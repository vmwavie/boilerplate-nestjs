import {compareSync} from 'bcryptjs';
import {type Request, type Response} from 'express';
import {sign} from 'jsonwebtoken';
import {appDataSource} from '../../config/data-source';
import User from '../../entities/user';

type AuthUserQuery = {
	email: string;
	password: string;
};

class AuthUserController {
	async handle(req: Request, res: Response): Promise<Response> {
		const {email, password} = req.body as AuthUserQuery;

		if (!email || !password) {
			return res.status(400).json({error: 'Email and password are required.'});
		}

		const userRepository = appDataSource.getRepository(User);

		try {
			const user = await userRepository.findOne({where: {email}});

			if (!user) {
				return res.status(401).json({error: 'Email does not exist.'});
			}

			if (!compareSync(password, user.passwordHash)) {
				return res.status(401).json({error: 'Email or password incorrect.'});
			}

			const token = sign(
				{email, userId: user.id},
				'e8d95a51f3af4a3b134bf6bb680a213a', // Generate token in https://www.md5hashgenerator.com/
				{expiresIn: '1d'},
			);

			return res.json({user, token});
		} catch (error) {
			return res.status(500).json({error: 'Login error, contact support.'});
		}
	}
}

export {AuthUserController};

