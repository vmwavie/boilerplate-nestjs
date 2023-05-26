import axios from 'axios';
import * as dotenv from 'dotenv';
import {type NextFunction, type Request, type Response} from 'express';

dotenv.config();

type CaptchaReq = {
	tokenCaptcha: string;
};

export async function verifyCaptcha(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const {tokenCaptcha} = req.body as CaptchaReq;
	const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA!}&response=${tokenCaptcha}`;
	const verify = await axios.post(url);
	if (verify.data.success === true) {
		next();
	} else {
		return res.status(500).json('Invalid Token Captcha');
	}
}
