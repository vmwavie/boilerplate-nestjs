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

		if (!authToken) {
			return res.status(401).end();
		}

		const [, token] = authToken.split(' ');

		const sub = verify(
			token,
			process.env.CRYPT_HASH!,
		) as Payload;
		const userRepository = appDataSource.getRepository(User);
		const userRole = await userRepository.findOne({where: {id: Number(sub.userId)}}) as UserInterface;

		if (userRole.id !== Number(id)) {
			return res.status(401).json('Unauthorized');
		}

		async function updateUser() {
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
		}

		void updateUser();

		return res.status(200).json('user updated successfully!');
	}
}

export {EditUserController};

