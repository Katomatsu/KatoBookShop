import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import ConnectMongoDBSession from 'connect-mongodb-session';
import { csrfSync } from 'csrf-sync';
import flash from 'connect-flash';
import { config } from 'dotenv';
config();
import multer from 'multer';

import { get404, get500 } from './controllers/errorController.js';
import adminRoutes from './routes/admin.js';
import shopRoutes from './routes/shop.js';
import authRoutes from './routes/auth.js';
import User from './models/userModel.js';
import throwTechError from './util/throwTechError.js';

const MONGODB_URI = `mongodb+srv://Kato:${process.env.DATABASE_PASSWORD}@katomarketcluster.bix4dpj.mongodb.net/shop?retryWrites=true&w=majority&appName=KatoMarketCluster`;
const MongoDBStore = ConnectMongoDBSession(session);

const app = express();
const store = new MongoDBStore({
	uri: MONGODB_URI,
	collection: 'sessions'
});

const { csrfSynchronisedProtection } = csrfSync({
	getTokenFromRequest: req => {
		if (req.is('multipart')) {
			return req.body['CSRFToken'];
		}
		// Otherwise use the header for all other request types
		return req.headers['x-csrf-token'];
	}
});

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './images');
	},
	filename: (req, file, cb) => {
		cb(null, `${new Date().getTime().toString()}-${file.originalname}`);
	}
});

const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === 'image/png' ||
		file.mimetype === 'image/jpg' ||
		file.mimetype === 'image/jpeg'
	) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.urlencoded({ extended: false }));
app.use(
	multer({
		dest: './images',
		storage: fileStorage,
		fileFilter: fileFilter
	}).single('image')
);
app.use(express.static('./public'));
app.use(express.static('./images'));
app.use(
	session({
		secret: 'my secret',
		resave: false,
		saveUninitialized: false,
		store: store
	})
);

app.use(csrfSynchronisedProtection);
app.use(flash());

app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.isLoggedIn;
	res.locals.csrfToken = req.csrfToken();
	next();
});

app.use(async (req, res, next) => {
	try {
		if (!req.session.user) {
			return next();
		}
		// findById here return full mongoose model with all methods and so on.
		const user = await User.findById(req.session.user._id);
		// Because of that you don't need to instantiate it with new User() on that line =>
		if (!user) {
			return next();
		}
		req.user = user;
		next();
	} catch (error) {
		throwTechError(error, next);
	}
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', get500);
app.use(get404);
app.use((error, req, res, next) => {
	console.log('108', error);
	res.status(500).render('500', {
		pageTitle: 'Internal Server Error!',
		path: '/500'
	});
});

const mongooseConnection = async () => {
	await mongoose.connect(MONGODB_URI);
	app.listen(8888);
};

mongooseConnection();
