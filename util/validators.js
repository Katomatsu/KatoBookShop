import { body } from 'express-validator';
import User from '../models/userModel.js';

export const loginValidator = [
	body('email')
		.isEmail()
		.withMessage('Please enter a valid email')
		.normalizeEmail(),
	body('password', 'invalid Password')
		.trim()
		.isLength({ min: 5 })
		.matches(/^[a-zA-Z0-9#$%&\s]+$/, 'g')
];

export const signupValidator = [
	body('name', 'Invalid Name').trim().isLength({ min: 2 }).isAlpha(),
	body('email')
		.isEmail()
		.withMessage('Please enter a valid email')
		.custom(async (value, { req }) => {
			const existingUser = await User.findOne({ email: value });
			if (existingUser) {
				return Promise.reject(
					'This email address is already in use. Please pick a different one'
				);
			}
		})
		.normalizeEmail(),
	body(
		'password',
		'Please enter a password with only numbers and text and at least 5 characters'
	)
		.trim()
		.isLength({ min: 5 })
		.matches(/^[a-zA-Z0-9#$%&\s]+$/, 'g'),
	body('confirmPassword')
		.trim()
		.custom((value, { req }) => {
			if (value !== req.body.password.trim()) {
				throw new Error('Passwords have to match');
			}
			return true;
		})
];

export const addProductValidator = [
	body('title', 'Invalid Title').isLength({ min: 3 }).isString().trim(),
	// body('imageUrl', 'Invalid Image URL').isURL(),
	body('price', 'Invalid Price').isFloat(),
	body('description', 'Invalid description').isLength({ min: 3 }).trim()
];
