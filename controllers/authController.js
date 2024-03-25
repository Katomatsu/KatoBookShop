import User from '../models/userModel.js';
import bcryptjs from 'bcryptjs';
import nodemailer from 'nodemailer';
import {config} from 'dotenv'

config()

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'adogairbekov@gmail.com',
		pass: process.env.EMAIL_PASSWORD
	}
});


export const getLogin = (req, res, next) => {
	let message = req.flash('error');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render('auth/login', {
		pageTitle: 'Login',
		path: '/login',
		errorMessage: message
	});
};

export const getSignup = (req, res, next) => {
	let message = req.flash('error');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render('auth/signup', {
		pageTitle: 'Sign Up',
		path: '/signup',
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

export const postSignup = async (req, res, next) => {
	try {
		const { name, email, password, confirmPassword } = req.body;
		if (name && email && password && confirmPassword) {
			const existingUser = await User.findOne({ email });
			if (existingUser) {
				req.flash('error', 'This email address is already in use. Please pick a different one');
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
			return await transporter.sendMail({
				to: email,
				from: 'KatoMarket@kato.com',
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