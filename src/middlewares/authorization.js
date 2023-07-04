import passport from "passport";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const {
	jwt: { cookieName, secret },
} = config;

export const passportCall = (strategy) => {
	return async (req, res, next) => {
		passport.authenticate(
			strategy,
			{ session: false },
			function (err, user, info) {
				if (err) return next(err);

				if (!user)
					user = {
						first_name: "guest",
						last_name: "guest",
						email: "guest",
						age: 0,
						role: "guest",
						cart: {},
					};

				req.user = user;
				next();
			}
		)(req, res, next);
	};
};

export const handlePolicies = (policies) => {
	return async (req, res, next) => {
		const role = req.user.role;

		if (!policies.includes(role)) {
			return res.status(403).send({ status: "error", error: "not authorized" });
		}

		next();
	};
};

export const validateTokenJwt = async (req, res, next) => {
	const { token } = req.query;
	console.log({ token });

	if (!token) {
		return res.status(400).send({
			status: "Error",
			message: "No token provided",
		});
	}

	try {
		const decoded = jwt.verify(token, secret);
		req.user = decoded;
		next();
	} catch (error) {
		return res.status(401).send({
			status: "Error",
			message: "Unauthorized",
		});
	}
};
