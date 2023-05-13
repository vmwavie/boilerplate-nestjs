import {randomBytes} from 'crypto';
import {diskStorage, type FileFilterCallback} from 'multer';
import {resolve} from 'path';

type MulterConfig = {
	dest: string;
	storage: ReturnType<typeof diskStorage>;
	limits: {
		fileSize: number;
	};
	fileFilter: (request: any, file: any, callback: FileFilterCallback) => void;
};

export const multerConfig: MulterConfig = {
	dest: resolve(__dirname, '..', '..', 'images'),
	storage: diskStorage({
		destination(request, file, callback) {
			callback(null, resolve(__dirname, '..', '..', 'images'));
		},
		filename(request, file, callback) {
			randomBytes(16, (error, hash) => {
				if (error) {
					callback(error, file.filename);
				}

				const filename = `${hash.toString('hex')}.png`;
				callback(null, filename);
			});
		},
	}),
	limits: {
		fileSize: 5 * 1024 * 1024,
	},
	fileFilter(request, file, callback) {
		const formats = [
			'image/jpeg',
			'image/jpg',
			'image/png',
		];

		if (formats.includes(file.mimetype as string)) {
			callback(null, true);
		} else {
			callback(new Error('Format not accepted'));
		}
	},
};
