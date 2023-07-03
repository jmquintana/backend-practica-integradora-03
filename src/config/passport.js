import passport from "passport";
import local from "passport-local";
import jwt from "passport-jwt";
import { usersModel } from "../models/users.model.js";
import { cartsService } from "../services/index.js";
import { createHash, isValidPassword } from "../utils.js";
import GitHubStrategy from "passport-github2";
import config from "./config.js";

const {
	githubAuth: { CLIENT_ID, CLIENT_SECRET, CALLBACK_URL },
	jwt: { cookieName, secret },
} = config;
const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const cookieExtractor = (req) => {
	let token = null;
	if (req && req.cookies) {
		token = req.cookies[cookieName];
	}
	return token;
};

const jwtOptions = {
	secretOrKey: secret,
	jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
};

const initializePassport = () => {
	passport.use(
		"register",
		new LocalStrategy(
			{
				passReqToCallback: true,
				usernameField: "email",
			},
			async (req, username, password, done) => {
				try {
					const { first_name, last_name, email, age, role } = req.body;
					let user = await usersModel.findOne({ email: username });
					if (user) {
						console.log("User already exists");
						return done(null, false);
					}

					const cart = await cartsService.addCart({ products: [] });
					const cartId = cart._id;
					console.log("passport linea 32", { cartId });

					const newUser = {
						first_name,
						last_name,
						email,
						age,
						role,
						cart,
						password: createHash(password),
					};

					let result = await usersModel.create(newUser);

					return done(null, result);
				} catch (error) {
					return done("Error when trying to find user:" + error);
				}
			}
		)
	);

	passport.use(
		"jwt",
		new JWTStrategy(jwtOptions, async (jwt_payload, done) => {
			try {
				return done(null, jwt_payload);
			} catch (error) {
				return done(error);
			}
		})
	);

	// DUPLICATED
	passport.use(
		"login",
		new LocalStrategy(
			{ usernameField: "email" },
			async (username, password, done) => {
				try {
					const user = await usersModel.findOne({ email: username });
					if (!user) return done(null, false);

					if (!isValidPassword(user, password)) return done(null, false);

					return done(null, user);
				} catch (error) {
					return done(error);
				}
			}
		)
	);

	passport.use(
		"github",
		new GitHubStrategy(
			{
				clientID: CLIENT_ID,
				clientSecret: CLIENT_SECRET,
				callbackURL: CALLBACK_URL,
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					let user = await userModel.findOne({ email: profile._json.email });
					if (!user) {
						const cart = await cartsModel.create({});
						let newUser = {
							first_name: profile._json.name,
							last_name: "",
							age: 18,
							email: profile._json.email,
							password: "",
							cart: cart._id,
						};

						let result = await userModel.create(newUser);
						return done(null, result);
					}

					return done(null, user);
				} catch (error) {
					return done(error);
				}
			}
		)
	);

	passport.serializeUser((user, done) => {
		done(null, user._id);
	});

	passport.deserializeUser(async (id, done) => {
		let user = await usersModel.findById(id);
		done(null, user);
	});

	// DUPLICATED
	passport.use(
		"githublogin",
		new GitHubStrategy(
			{
				clientID: CLIENT_ID,
				clientSecret: CLIENT_SECRET,
				callbackURL: CALLBACK_URL,
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					const user = await usersModel.findOne({
						email: profile._json.email,
					});
					if (!user) {
						const newUser = {
							first_name: profile._json.name,
							last_name: "",
							email: profile._json.email,
							age: 18,
							role: "user",
							cart: await cartsService.addCart({ products: [] }),
							password: "",
						};
						const result = await usersModel.create(newUser);
						return done(null, result);
					}
					return done(null, user);
				} catch (error) {
					return done(error);
				}
			}
		)
	);
};

export default initializePassport;
