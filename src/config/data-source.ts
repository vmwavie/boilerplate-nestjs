import 'reflect-metadata';
import {DataSource} from 'typeorm';
import User from '../entities/user';
import {CreateUserTable1682197861733} from './migrations/1682197861733-CreateUserTable';

export const appDataSource = new DataSource({
	type: 'postgres',
	host: '0.0.0.0', // 0.0.0.0 for external connection & backend-db-1 for connect to docker
	port: 5432,
	username: 'postgres',
	password: '123123',
	database: 'blog-math',
	synchronize: true,
	logging: false,
	entities: [User],
	migrations: [CreateUserTable1682197861733],
	subscribers: [],
});
