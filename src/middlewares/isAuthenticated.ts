import * as dotenv from 'dotenv';
import {type NextFunction, type Request, type Response} from 'express';
import {verify} from 'jsonwebtoken';

type Payload = {
	sub: string;
	userId(userId: number): unknown;
};

export async function isAuthenticated(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	dotenv.config();

	const authToken = req.headers.authorization;

	if (!authToken) {
		return res.status(401).end();
	}

	const [, token] = authToken.split(' ');

	try {
		verify(
			token,
			process.env.CRYPT_HASH!,
		) as Payload;

		next();
	} catch (err) {
		return res.status(500).json('Login with your account to access the page');
	}
}
