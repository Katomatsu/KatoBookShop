import User from '../models/userModel.js';

export const getLogin = (req, res, next) => {
	// const isLoggedIn = req.get('Cookie').split('=')[1] === 'true';
	res.render('auth/login', {
		pageTitle: 'Login',
		path: '/login',
		isAuthenticated: req.session.isLoggedIn
	});
};

export const postLogin = async (req, res, next) => {
	try {
		// findById here return full mongoose model with all methods and so on.
		const user = await User.findById('65fee90b61282650d28658c5');
		// Because of that you don't need to instantiate it with new User() on that line =>
		req.session.isLoggedIn = true;
		req.session.user = user;
		req.session.save(err => {
			console.log(err);
			res.redirect('/');
		});
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
