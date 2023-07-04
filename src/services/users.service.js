import { emailTemplates } from "../templates/email.js";
import { usersRepository } from "../repositories/index.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { isValidPassword, createHash } from "../utils.js";

const {
	jwt: { cookieName, secret },
} = config;

export default class UserService {
	constructor(mailingService) {
		this.mailingService = mailingService;
	}

	getUserById = async (id) => {
		try {
			const user = await usersRepository.getUserById(id);
			return user;
		} catch (error) {
			console.log();
			return null;
		}
	};

	getUser = async ({ email }) => {
		try {
			const user = await usersRepository.getUser({ email });
			return user;
		} catch (error) {
			console.log();
			return null;
		}
	};

	createUser = async (user) => {
		try {
			const user = await usersRepository.createUser(user);
			return user;
		} catch (error) {
			console.log();
			return null;
		}
	};

	restorePasswordProcess = async (email) => {
		try {
			const user = await usersRepository.getUser({ email });
			if (!user) throw new Error(`Something went wrong`);
			console.log(user);
			const { first_name } = user;

			const token = jwt.sign({ email }, secret, {
				expiresIn: "1h",
			});
			if (!token) throw new Error("Auth token signing failed");

			const mail = {
				to: email,
				subject: `Your password restore, ${first_name}!`,
				html: emailTemplates.passwordRestoreEmail(email, first_name, token),
			};

			await this.mailingService.sendEmail(mail);
			return;
		} catch (error) {
			console.log(`Failed to send email: ${error}`);
			throw error;
		}
	};

	passwordValidate = async (user, password) => {
		return isValidPassword(user, password);
	};

	updatePassword = async (token, password) => {
		try {
			const decodedToken = jwt.verify(token, secret, {
				ignoreExpiration: true,
			});
			const { email } = decodedToken;
			if (Date.now() / 1000 > decodedToken.exp) {
				throw new Error("Token has expired. Request another restore link.");
			}

			const user = await usersRepository.getUser({ email });
			const samePass = await this.passwordValidate(user, password);
			if (samePass)
				throw new Error("Password must be different from the actual one.");

			const hashedPassword = createHash(password);
			if (!hashedPassword) throw new Error("Password hashing failed");

			const passwordUpdate = await usersRepository.updateUser(email, {
				password: hashedPassword,
			});
			if (!passwordUpdate)
				throw new Error(`Password update failed for ${email}`);
			return passwordUpdate;
		} catch (error) {
			console.log(`Failed to update password: ${error}`);
			throw error;
		}
	};
}
