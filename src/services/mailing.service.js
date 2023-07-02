import mailer from "nodemailer";
import config from "../config/config.js";

const {
	nodemailer: { service, port, user, password },
} = config;

class MailingService {
	constructor() {
		this.client = mailer.createTransport({
			service,
			port,
			auth: {
				user,
				pass: password,
			},
		});
	}

	sendEmail = async ({ from, to, subject, html, attachments = [] }) => {
		let result = await this.client.sendMail({
			from,
			to,
			subject,
			html,
			attachments,
		});
		console.log(result);
		return null;
	};
}

export const mailingService = new MailingService();
