import User from '../models/userModel.js';
import bcryptjs from 'bcryptjs';
import nodemailer from 'nodemailer';
import { config } from 'dotenv';
config();
import crypto from 'crypto';
import { read } from 'fs';

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'adogairbekov@gmail.com',
		pass: process.env.EMAIL_PASSWORD
	}
});

export const getLogin = (req, res, next) => {
	const errorMessages = req.flash('error');
	const message = errorMessages.length > 0 ? errorMessages[0] : null;
	res.render('auth/login', {
		pageTitle: 'Login',
		path: '/login',
		errorMessage: message
	});
};

export const postLogin = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			req.flash('error', 'Invalid Email or Password');
			return res.redirect('/login');
		}
		const comparisonRes = await bcryptjs.compare(password, user.password);
		if (comparisonRes) {
			req.session.isLoggedIn = true;
			req.session.user = user;
			return req.session.save(err => {
				console.log(err);
				res.redirect('/');
			});
		}
		req.flash('error', 'Invalid Email or Password');
		res.redirect('/login');
	} catch (error) {
		console.log(error);
	}
};

export const getSignup = (req, res, next) => {
	const errorMessages = req.flash('error');
	const message = errorMessages.length > 0 ? errorMessages[0] : null;
	res.render('auth/signup', {
		pageTitle: 'Sign Up',
		path: '/signup',
		errorMessage: message
	});
};

export const postSignup = async (req, res, next) => {
	try {
		const { name, email, password, confirmPassword } = req.body;
		if (name && email && password && confirmPassword) {
			const existingUser = await User.findOne({ email });
			if (existingUser) {
				req.flash(
					'error',
					'This email address is already in use. Please pick a different one'
				);
				return res.redirect('/signup');
			}
			const hashedPassword = await bcryptjs.hash(password, 12);
			const user = new User({
				name,
				password: hashedPassword,
				email,
				cart: { items: [] }
			});
			await user.save();
			res.redirect('/login');

			await transporter.sendMail({
				to: email,
				from: '"KatoMarket" adogairbekov@gmail.com',
				subject: 'Sign up succeeded!',
				html: `<h1>Hello ${name}. You successfully signed up!</h1>`
			});
		}
		req.flash('error', 'Please ensure that the entered data is valid.');
		res.redirect('/signup');
	} catch (error) {
		console.log(error);
	}
};

export const postLogout = (req, res, next) => {
	req.session.destroy(err => {
		console.log(err);
		res.redirect('/');
	});
};

export const getReset = (req, res, next) => {
	const errorMessages = req.flash('error');
	const message = errorMessages.length > 0 ? errorMessages[0] : null;
	res.render('auth/resetPassword', {
		pageTitle: 'Reset Password',
		path: '/reset',
		errorMessage: message
	});
};

export const postReset = (req, res, next) => {
	try {
		crypto.randomBytes(32, async (err, buffer) => {
			if (err) {
				console.log(err);
				return res.redirect('/reset');
			}
			const token = buffer.toString('hex');
			const user = await User.findOne({ email: req.body.email });

			if (!user) {
				req.flash('error', 'Can not find account with that email');
				return res.redirect('/reset');
			}

			user.resetToken = token;
			user.resetTokenExpiration = Date.now() + 3600000;
			await user.save();

			res.redirect('/');
			await transporter.sendMail({
				to: user.email,
				from: '"KatoMarket" adogairbekov@gmail.com',
				subject: 'Password Reset!',
				html: `
          <p>You requested a password reset</p>
          <p>Click this <a href='http://localhost:8888/reset/${token}'>link</a> to set a new password</p>
        `
			});
		});
	} catch (error) {
		console.log(error);
	}
};

export const getNewPassword = async (req, res, next) => {
	try {
		const { token } = req.params;
		const user = await User.findOne({
			resetToken: token,
			resetTokenExpiration: { $gt: Date.now() }
		}); // $gt means: greater than

		if (user) {
			const errorMessages = req.flash('error');
			const message = errorMessages.length > 0 ? errorMessages[0] : null;
			res.render('auth/newPassword', {
				pageTitle: 'New Password',
				path: '/reset',
				errorMessage: message,
				userId: user._id,
				passwordToken: token
			});
		}
	} catch (error) {
		console.log(error);
	}
};

export const postNewPassword = async (req, res, next) => {
	try {
		const { userId, passwordToken, password } = req.body;
		const user = await User.findOne({
			_id: userId,
			resetToken: passwordToken,
			resetTokenExpiration: { $gt: Date.now() }
		});
    if (!user) {
      req.flash('error', 'The token has expired')
      return res.redirect(`/reset/${passwordToken}`)
    }
		const hashedPassword = await bcryptjs.hash(password, 12);
		user.password = hashedPassword;
		user.resetToken = undefined;
		user.resetTokenExpiration = undefined;
		await user.save();
		res.redirect('/login');
	} catch (error) {
		console.log(error);
	}
};
