import {hash} from 'bcryptjs';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';
import {type Request, type Response} from 'express';
import {appDataSource} from '../../config/data-source';
import User from '../../entities/user';
import {type RegisterUserQuery} from '../../interfaces/user';

dotenv.config();

class RegisterUserController {
	async handle(req: Request, res: Response): Promise<any> {
		const {name, email, password, verifyToken} = req.body as RegisterUserQuery;

		const userRepository = appDataSource.getRepository(User);
		const userData = await userRepository.findOne({
			where: {
				email,
			},
		});

		if (userData?.email === email || userData?.verifyToken === verifyToken) {
			return res.status(400).json('Email or code is invalid');
		}

		if (!verifyToken || email === '' || name === '' || password === '') {
			return res.status(400).json('User already exists');
		}

		const decryptToken = () => {
			const buffer = Buffer.from(verifyToken, 'base64');
			const iv = buffer.slice(0, 12);
			const tag = buffer.slice(12, 28);
			const encryptedData = buffer.slice(28);
			const decipher = crypto.createDecipheriv('aes-256-gcm', process.env.TOKEN_HASH!, iv);
			decipher.setAuthTag(tag);
			const decryptedCode = Buffer.concat([decipher.update(encryptedData), decipher.final()]).toString('utf-8');
			const parts = decryptedCode.split('-');
			const timestamp = parseInt(parts[0], 10);
			const currentTime = new Date().getTime();
			const expirationTime = 10 * 60 * 1000;
			return currentTime - timestamp <= expirationTime;
		};

		const isValid = decryptToken();

		if (!isValid) {
			return res.status(400).json('Invalid or expired token');
		}

		const role = 'member';
		const photo = 'default.png';

		const passwordHash: string = await hash(password, 8);

		const user = userRepository.create({
			name,
			email,
			passwordHash,
			role,
			photo,
			verifyToken,
		});

		await userRepository.save(user);

		return res.json(user);
	}
}

export {RegisterUserController};

