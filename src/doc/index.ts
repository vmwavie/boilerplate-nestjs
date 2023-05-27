import {type Request, type Response} from 'express';
import {readFileSync} from 'fs';

class Documentation {
	async handle(req: Request, res: Response): Promise<Response> {
		const data = readFileSync(`${__dirname}/swagger_output.json`, {encoding: 'utf-8'});
		return res.json(data);
	}
}

export {Documentation};
