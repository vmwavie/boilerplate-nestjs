import * as dotenv from 'dotenv';
import request from 'supertest';
import {cryptToken} from '../../../src/utils';
import {defaultUser, token} from '../utils';

dotenv.config();

const userData = {
	id: defaultUser.id,
	email: defaultUser.email,
	password: defaultUser.password,
	role: defaultUser.role,
	verifyToken: cryptToken,
	tokenCaptcha: defaultUser.tokenCaptcha,
};

describe('EditUserController', () => {
	it('should edit a new user', async () => {
		const response = await request(`${process.env.BaseUrl!}`)
			.put('/me')
			.send(userData)
			.auth(token, {type: 'bearer'});

		expect(response.status).toBe(200);
	});
});
