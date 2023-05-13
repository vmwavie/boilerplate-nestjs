import * as crypto from 'crypto';
import validate from 'deep-email-validator';
import * as dotenv from 'dotenv';
import {type Request, type Response} from 'express';
import {createTransport} from 'nodemailer';
import {v1} from 'uuid';

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

		function generateVerificationCode() {
			const timestamp = new Date().getTime();
			const uuid = v1();
			const verificationCode = `${timestamp}-${uuid}`;
			return verificationCode;
		}

		const verifyCode = generateVerificationCode();

		function encryptVerificationCode() {
			const iv = crypto.randomBytes(12);
			const cipher = crypto.createCipheriv('aes-256-gcm', process.env.TOKEN_HASH!, iv);
			const encryptedCode = Buffer.concat([cipher.update(verifyCode, 'utf8'), cipher.final()]);
			const tag = cipher.getAuthTag();
			return Buffer.concat([iv, tag, encryptedCode]).toString('base64');
		}

		const cryptToken = encryptVerificationCode();

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
			<p style="font-size:16px;color:#555;line-height:1.2;font-family:Arial,Helvetica Neue,Helvetica,sans-serif">Click on the button below to proceed with the registration:</p>
			<p>
				<a style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#92cc22;border-radius:5px;width:auto;border-top:0px solid transparent;font-weight:400;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:5px;padding-bottom:5px;font-family:Arial,Helvetica Neue,Helvetica,sans-serif;font-size:16px;text-align:center;word-break:keep-all"
					href=${process.env.PASSWORD_LINK!}?code=${cryptToken}>
					<span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;letter-spacing:normal">
					Register a password
					</span>
				</a>
			</p>
		`;

		await transporter.sendMail({
			from: process.env.MAIL_PROVIDER,
			to: email,
			subject: 'Register a password',
			html: emailBody,
		});

		res.json('If an account is registered to this email, we send a verification link to it.').status(200);
	}
}

export {VerifyMail};

