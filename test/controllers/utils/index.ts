import {sign} from 'jsonwebtoken';

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
	'e8d95a51f3af4a3b134bf6bb680a213a',
	{expiresIn: '1d'},
);
