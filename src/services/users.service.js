import { emailTemplates } from "../templates/email.js";
import { mailingService } from "./mailing.service.js";
import { usersRepository } from "../repositories/index.js";

export default class UserService {
	constructor(mailService) {
		this.mailService = mailService;
	}

	async restorePasswordProcess(email) {
		try {
			const user = await usersRepository.getUser({ email });
			if (!user) throw new Error(`Something went wrong`);
			console.log(user);
			const { first_name } = user;

			const token = jwt.sign({ email }, JWT_SECRET, {
				expiresIn: "1h",
			});
			if (!token) throw new Error("Auth token signing failed");

			const mail = {
				to: email,
				subject: `Your password restore, ${first_name}!`,
				html: emailTemplates.passwordRestoreEmail(email, first_name, token),
			};

			await this.mailService.sendEmail(mail);
			return;
		} catch (error) {
			console.log(`Failed to send email: ${error}`);
			throw error;
		}
	}

	async updatePassword(token, password) {
		try {
			const decodedToken = jwt.verify(token, JWT_SECRET, {
				ignoreExpiration: true,
			});
			const { email } = decodedToken;
			if (Date.now() / 1000 > decodedToken.exp) {
				throw new Error("Token has expired. Request another restore link.");
			}

			const user = await usersRepository.getUser({ email });
			const samePass = this.passwordValidate(user, password);
			if (samePass)
				throw new Error("Password must be different from the actual one.");

			const hashedPassword = createHash(password);
			if (!hashedPassword) throw new Error("Password hashing failed");

			const passwordUpdate = await usersRepository.updateUser(
				{ email },
				{ password: hashedPassword }
			);
			if (!passwordUpdate)
				throw new Error(`Password update failed for ${email}`);
			return passwordUpdate;
		} catch (error) {
			console.log(`Failed to update password: ${error}`);
			throw error;
		}
	}
}
