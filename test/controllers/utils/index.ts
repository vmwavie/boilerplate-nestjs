import * as dotenv from 'dotenv';
import {sign} from 'jsonwebtoken';

dotenv.config();

export const defaultUser = {
	id: 17,
	email: 'testuser@gmail.com',
	password: '123123',
	role: 'admin',
	tokenCaptcha: 'anytoken',
};

const tokenData = {
	email: defaultUser.email,
	userId: defaultUser.id,
};

export const token = sign(
	tokenData,
	process.env.CRYPT_HASH!,
	{expiresIn: '1d'},
);
