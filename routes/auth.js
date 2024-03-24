import express from 'express';
import { getLogin, postLogin, postLogout } from '../controllers/authController.js';

const authRouter = express.Router()

authRouter.get('/login', getLogin)
authRouter.post('/login', postLogin)
authRouter.post('/logout', postLogout)

export default authRouter