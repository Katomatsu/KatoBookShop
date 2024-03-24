import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import ConnectMongoDBSession from 'connect-mongodb-session';

import get404 from './controllers/errorController.js';
import adminRoutes from './routes/admin.js';
import shopRoutes from './routes/shop.js';
import authRoutes from './routes/auth.js';
import User from './models/userModel.js'

const MONGODB_URI =
	'mongodb+srv://Kato:mwg8cRLzcxAJ3a5P@katomarketcluster.bix4dpj.mongodb.net/shop?retryWrites=true&w=majority&appName=KatoMarketCluster';

const MongoDBStore = ConnectMongoDBSession(session);

const store = new MongoDBStore({
	uri: MONGODB_URI,
	collection: 'sessions'
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.urlencoded({ extended: false }));
app.use(express.static('./public'));
app.use(
	session({
		secret: 'my secret',
		resave: false,
		saveUninitialized: false,
		store: store
	})
);

app.use(async (req, res, next) => {
	try {
    if (!req.session.user) {
      return next()
    }
		// findById here return full mongoose model with all methods and so on.
		const user = await User.findById(req.session.user._id);
		// Because of that you don't need to instantiate it with new User() on that line =>
		req.user = user
		next();
	} catch (error) {
		console.log(error);
	}
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(get404);

const mongooseConnection = async () => {
	await mongoose.connect(MONGODB_URI);

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

mongooseConnection();
