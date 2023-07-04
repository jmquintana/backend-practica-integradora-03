export const emailTemplates = {
	passwordRestoreEmail: (email, name, token) => `
    <!DOCTYPE html>
      <html>
        <head>
            <meta charset="utf-8" />
            <meta http-equiv="x-ua-compatible" content="ie=edge" />
            <title>Reset Password</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body style="background-color: #f6f6f6; font-family: sans-serif; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
            <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border-spacing: 0; width: 100%;">
                <tr>
                    <td style="background-color: #f6f6f6; text-align: center;">
                        <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border-spacing: 0; width: 100%; background-color: #fff; max-width: 600px; margin: 0 auto;">
                            <tr>
                                <td style="padding: 20px 20px; text-align: center;">
                                    <h1 style="font-size: 24px; margin: 0;">Hello, ${name}!</h1>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 20px 20px;">
                                    <p style="margin: 0;">
                                        You are receiving this email because we received a password reset request for your account.
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0 20px;">
                                    <a href="http://localhost:3000/reset?token=${token}" style="background-color: #1a1a1a; color: #fff; display: inline-block; padding: 15px 25px; text-decoration: none;">Reset Password</a>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 20px 20px;">
                                    <p style="margin: 0;">
                                        If you did not request a password reset, no further action is required.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </html>`,
};
