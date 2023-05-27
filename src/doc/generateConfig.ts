import swaggerAutogen from 'swagger-autogen';

const doc = {
	info: {
		title: 'Payment-API',
		description: '',
		schema: '',
	},
	host: '',
	schemes: [],
	basePath: '',
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['../routes.ts'];

swaggerAutogen(outputFile, endpointsFiles, doc);
