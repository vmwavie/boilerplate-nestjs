import * as dotenv from 'dotenv';
import express from 'express';
import 'express-async-errors';
import path from 'path';

import bodyParser from 'body-parser';
import {appDataSource} from './config/data-source';
import routers from './routes';

import {serve, setup} from 'swagger-ui-express';
import swaggerFile from './doc/swagger_output.json';

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use('/swagger-ui', serve, setup(swaggerFile));

app.use(
	'/images',
	express.static(path.resolve(__dirname, '..', 'images')),
);
app.use(express.json());
app.use(routers);

appDataSource.initialize()
	.then(() => {
		console.log('Database OK');
		app.listen(process.env.PORT, () => {
			console.log(`Server started on port ${process.env.PORT!}`);
		});
	})
	.catch(error => {
		console.error(error);
	});

