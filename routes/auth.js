import express from 'express';
import { getLogin, postLogin, postLogout, getSignup, postSignup } from '../controllers/authController.js';

const authRouter = express.Router()

authRouter.get('/login', getLogin)
authRouter.get('/signup', getSignup);
authRouter.post('/login', postLogin)
authRouter.post('/signup', postSignup);
authRouter.post('/logout', postLogout)

export default authRouter