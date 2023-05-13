import * as dotenv from 'dotenv';
import {type NextFunction, type Request, type Response} from 'express';
import {verify} from 'jsonwebtoken';
import {appDataSource} from '../config/data-source';
import User from '../entities/user';
import type {UserInterface} from '../interfaces/user';

type Payload = {
	sub: string;
	userId(userId: number): unknown;
};

export async function isAdministrator(
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
		const sub = verify(
			token,
			process.env.CRYPT_HASH!,
		) as Payload;

		const userRepository = appDataSource.getRepository(User);
		const userRole = await userRepository.findOne({where: {id: Number(sub.userId)}}) as UserInterface;

		if (userRole.role !== 'admin') {
			return res.status(401).json('Unauthorized');
		}

		next();
	} catch (error) {
		console.error(error);
		return res.status(500).json('Internal Server Error');
	}
}
