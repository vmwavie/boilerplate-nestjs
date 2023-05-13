import {Router} from 'express';
import multer from 'multer';
import {multerConfig} from './config/multer';

import {verifyCaptcha} from './middlewares/captcha';
import {isAuthenticated} from './middlewares/isAuthenticated';

import {AuthUserController} from './controllers/User/authUser.controller';
import {EditUserController} from './controllers/User/editUser.controller';
import {RegisterUserController} from './controllers/User/registerUser.controller';
import {VerifyMail} from './controllers/User/verifyMail.controller';

const routers = Router();

routers.post('/register', verifyCaptcha, new RegisterUserController().handle);
routers.post('/verify-email', verifyCaptcha, new VerifyMail().handle);
routers.post('/login', verifyCaptcha, new AuthUserController().handle);
routers.put('/me', isAuthenticated, multer(multerConfig).single('photo'), new EditUserController().handle);

export default routers;
