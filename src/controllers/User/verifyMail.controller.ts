import validate from 'deep-email-validator';
import * as dotenv from 'dotenv';
import {type Request, type Response} from 'express';
import {createTransport} from 'nodemailer';
import {cryptToken} from '../../utils';

dotenv.config();

type EmailVerify = {
	email: string;
};

class VerifyMail {
	async handle(req: Request, res: Response): Promise<Response | undefined> {
		const {email} = req.body as EmailVerify;
		// eslint-disable-next-line @typescript-eslint/naming-convention
		const verify = await validate({email, validateSMTP: false});

		if (!verify.valid) {
			return;
		}

		const transporter = createTransport({
			host: 'sandbox.smtp.mailtrap.io',
			port: 2525,
			auth: {
				user: process.env.MAILTRAP_USER,
				pass: process.env.MAILTRAP_PASS,
			},
		});

		const emailBody = `
			<p style="font-size:16px;color:#555;line-height:1.2;font-family:Arial,Helvetica Neue,Helvetica,sans-serif">Hi,</p>
			<p style="font-size:16px;color:#555;line-height:1.2;font-family:Arial,Helvetica Neue,Helvetica,sans-serif">Use the code below to verify on the website:</p>
			<p style="font-size:13px;color:#171717;font-family:Arial,Helvetica Neue,Helvetica,sans-serif">
			${cryptToken}
			</p>
		`;

		await transporter.sendMail({
			from: process.env.MAIL_PROVIDER,
			to: email,
			subject: 'Verification Code',
			html: emailBody,
		});

		res.json('If an account is registered to this email, we send a verification link to it.').status(200);
	}
}

export {VerifyMail};

