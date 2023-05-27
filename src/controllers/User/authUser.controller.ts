import {compareSync} from 'bcryptjs';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';
import {type Request, type Response} from 'express';
import {sign} from 'jsonwebtoken';
import {appDataSource} from '../../config/data-source';
import User from '../../entities/user';

type AuthUserQuery = {
	email: string;
	password: string;
	verifyToken: string;
};

dotenv.config();

class AuthUserController {
	async handle(req: Request, res: Response): Promise<Response> {
		const {email, password, verifyToken} = req.body as AuthUserQuery;

		if (!verifyToken || !email || !password) {
			return res.status(400).json({error: 'Email and password are required.'});
		}

		const userRepository = appDataSource.getRepository(User);

		try {
			const user = await userRepository.findOne({where: {email}});

			if (!user) {
				return res.status(401).json({error: 'Email does not exist.'});
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

			if (!compareSync(password, user.passwordHash)) {
				return res.status(401).json({error: 'Email or password incorrect.'});
			}

			void userRepository.update(user.id, {verifyToken});

			const token = sign(
				{email, userId: user.id},
				process.env.CRYPT_HASH!,
				{expiresIn: '1000d'},
			);

			return res.json({token});
		} catch (error) {
			return res.status(500).json({error: 'Login error, contact support.'});
		}
	}
}

export {AuthUserController};

