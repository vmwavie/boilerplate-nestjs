import {faker} from '@faker-js/faker';
import * as dotenv from 'dotenv';
import request from 'supertest';
import {cryptToken} from '../../../src/utils';
import {defaultUser} from '../utils';

dotenv.config();

const userData = {
	name: faker.internet.userName(),
	email: faker.internet.email(),
	password: faker.internet.password(),
	verifyToken: cryptToken,
	tokenCaptcha: defaultUser.tokenCaptcha,
};

describe('RegisterUserController', () => {
	it('should register a new user', async () => {
		const response = await request(`${process.env.BaseUrl!}`)
			.post('/register')
			.send(userData);

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('name', userData.name);
		expect(response.body).toHaveProperty('email', userData.email);
	});
});
