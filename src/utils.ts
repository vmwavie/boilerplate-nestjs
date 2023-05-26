import * as crypto from 'crypto';
import * as dotenv from 'dotenv';
import {v1} from 'uuid';

dotenv.config();

function generateVerificationCode() {
	const timestamp = new Date().getTime();
	const uuid = v1();
	const verificationCode = `${timestamp}-${uuid}`;
	return verificationCode;
}

const verifyCode = generateVerificationCode();

function encryptVerificationCode() {
	const iv = crypto.randomBytes(12);
	const cipher = crypto.createCipheriv('aes-256-gcm', process.env.TOKEN_HASH!, iv);
	const encryptedCode = Buffer.concat([cipher.update(verifyCode, 'utf8'), cipher.final()]);
	const tag = cipher.getAuthTag();
	return Buffer.concat([iv, tag, encryptedCode]).toString('base64');
}

const cryptToken = encryptVerificationCode();

export {cryptToken};
