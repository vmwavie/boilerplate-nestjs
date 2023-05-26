import * as crypto from 'crypto';
import * as dotenv from 'dotenv';
import {type Request, type Response} from 'express';
import fs from 'fs';
import {verify} from 'jsonwebtoken';
import {appDataSource} from '../../config/data-source';
import User from '../../entities/user';
import type {UserInterface} from '../../interfaces/user';

type Payload = {
	sub: string;
	userId(userId: number): unknown;
};

class EditUserController {
	async handle(req: Request, res: Response): Promise<Response> {
		dotenv.config();

		const {id, name, email, role, verifyToken} = req.body as UserInterface;
		const authToken = req.headers.authorization;

		if (!authToken || !verifyToken || !email) {
			return res.status(401).end();
		}

		try {
			const userRepository = appDataSource.getRepository(User);
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

			const [, token] = authToken.split(' ');
			const sub = verify(
				token,
				process.env.CRYPT_HASH!,
			) as Payload;

			const userRole = await userRepository.findOne({where: {id: Number(sub.userId)}}) as UserInterface;

			if (userRole.id !== Number(id)) {
				return res.status(401).json('Unauthorized');
			}

			const userData = await userRepository.findOne({where: {id}});
			const photoOriginal: string = userData!.photo ?? '';
			const photo: string = req.file?.filename ?? '';
			const newUser: UserInterface = {name, email, role, photo, verifyToken};

			if (photoOriginal) {
				fs.unlinkSync(`${__dirname}/../../../images/${photoOriginal}`);
			}

			if (userData) {
				const userUpdate = userRepository.merge(userData, newUser);
				await userRepository.save(userUpdate);
			}

			return res.status(200).json('User updated successfully!');
		} catch (err) {
			console.log(err);
			return res.status(500).json({error: 'Login error, contact support.'});
		}
	}
}

export {EditUserController};

