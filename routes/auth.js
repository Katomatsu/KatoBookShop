import express from 'express';
import { getLogin, postLogin, postLogout, getSignup, postSignup, getReset, postReset, getNewPassword, postNewPassword } from '../controllers/authController.js';

const authRouter = express.Router()

authRouter.get('/login', getLogin)
authRouter.get('/signup', getSignup);
authRouter.get('/reset', getReset)
authRouter.get('/reset/:token', getNewPassword);
authRouter.post('/new-password', postNewPassword);
authRouter.post('/reset', postReset)
authRouter.post('/login', postLogin)
authRouter.post('/signup', postSignup);
authRouter.post('/logout', postLogout)

export default authRouter