import express from 'express';

import mongoose from 'mongoose';

import get404 from './controllers/errorController.js';
import adminRoutes from './routes/admin.js';
import shopRoutes from './routes/shop.js';
import User from './models/userModel.js';

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.urlencoded({ extended: false }));
app.use(express.static('./public'));

app.use(async (req, res, next) => {
	try {
		// findById here return full mongoose model with all methods and so on.
		const user = await User.findById('65fbdeb20e86641c3427698e');
		// Because of that you don't need to instantiate it with new User() on that line =>
		req.user = user;
		next();
	} catch (error) {
		console.log(error);
	}
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(get404);

const mongooseConnection = async () => {
  await mongoose.connect(
		'mongodb+srv://Kato:mwg8cRLzcxAJ3a5P@katomarketcluster.bix4dpj.mongodb.net/shop?retryWrites=true&w=majority&appName=KatoMarketCluster'
	);

	const user = await User.findOne();
	if (!user) {
		const newUser = new User({
			name: 'Kato',
			email: 'ado@gmail.com',
			cart: {
				items: []
			}
		});
		await newUser.save();
	}

	app.listen(8888);
};

mongooseConnection()