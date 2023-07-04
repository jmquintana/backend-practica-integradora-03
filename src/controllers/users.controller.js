import { usersService, cartsService } from "../services/index.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { isValidPassword } from "../utils.js";

const {
	jwt: { cookieName, secret },
} = config;

export const register = async (req, res) => {
	try {
		return res.send({ status: "Success", message: "user registered" });
	} catch (error) {
		console.log(error);
	}
};

export const failRegister = async (req, res) => {
	try {
		console.log("Failed Register");
		return res.send({ status: "Error", error: "authentication error" });
	} catch (error) {
		console.log(error);
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await usersService.getUser({ email });

		if (!user)
			return res
				.status(401)
				.send({ status: "Error", error: "Invalid Credentials" });

		if (!isValidPassword(user, password))
			return res
				.status(401)
				.send({ status: "Error", error: "Invalid Credentials" });

		const cartCount =
			user.role === "admin"
				? 0
				: await cartsService.getCartCount(user.cart._id);

		const jwtUser = {
			first_name: user.first_name,
			last_name: user.last_name,
			name: `${user.first_name} ${user.last_name}`,
			email: user.email,
			age: user.age,
			cart: user.cart,
			role: user.role,
			cartCount,
		};
		const token = jwt.sign(jwtUser, secret, { expiresIn: "24h" });

		return res.cookie(cookieName, token, { httpOnly: true }).send({
			status: "Success",
			message: "Login successful",
		});
	} catch (error) {
		console.log(error);
	}
};

export const gitHubLogin = async (req, res) => {
	try {
		const jwtUser = {
			name: req.user.first_name,
			email: req.user.email,
			cart: req.user.cart,
		};

		const token = jwt.sign(jwtUser, secret, { expiresIn: "24h" });

		return res.cookie(cookieName, token, { httpOnly: true }).redirect("/");
	} catch (error) {
		console.log(error);
	}
};

export const logout = async (req, res) => {
	try {
		return res
			.clearCookie(cookieName)
			.send({ status: "Success", message: "log out successful" });
	} catch (error) {
		console.log(error);
	}
};

export const restorePasswordProcess = async (req, res) => {
	try {
		const { email } = req.body;

		if (!email) {
			return res.status(400).send({
				status: "Error",
				error: "Incomplete values",
			});
		}

		await usersService.restorePasswordProcess(email);

		return res.status(200).send({
			status: "Success",
			message: "Password reset email sent",
		});
	} catch (error) {
		req.logger.error(`Failed to send password reset email: ${error}`);
		return res.status(500).send({ status: "error", error: `${error}` });
	}
};

export const updatePassword = async (req, res) => {
	try {
		const { password, token } = req.body;

		console.log({ password, token });

		if (!password || !token) {
			return res.status(400).send({
				status: "Error",
				error: "Incomplete values",
			});
		}

		const passwordUpdate = await usersService.updatePassword(token, password);

		if (!passwordUpdate) {
			return res
				.status(500)
				.send({ status: "Error", error: "Failed to update password" });
		}

		return res.status(200).send({
			status: "Success",
			message: "Successfully updated password",
		});
	} catch (error) {
		req.logger.error(`Failed to restore user password: ${error}`);
		return res.status(500).send({ status: "error", error: `${error}` });
	}
};
