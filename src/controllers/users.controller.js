import { usersService } from "../services/index.js";

export const restorePasswordProcess = async (req, res) => {
	try {
		const { email } = req.body;

		if (!email) {
			return res.status(400).send({
				status: "error",
				error: "Incomplete values",
			});
		}

		await usersService.restorePasswordProcess(email);

		return res.status(200).send({
			status: "success",
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

		if (!password || !token) {
			return res.status(400).send({
				status: "error",
				error: "Incomplete values",
			});
		}

		const passwordUpdate = await usersService.updatePassword(token, password);

		if (!passwordUpdate) {
			return res
				.status(500)
				.send({ status: "error", error: "Failed to update password" });
		}

		return res.status(200).send({
			status: "success",
			message: "Successfully updated password",
		});
	} catch (error) {
		req.logger.error(`Failed to restore user password: ${error}`);
		return res.status(500).send({ status: "error", error: `${error}` });
	}
};
