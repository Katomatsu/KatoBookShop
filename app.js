const express = require('express');

const errorController = require('./controllers/errorController');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const sequelize = require('./util/database');
const Product = require('./models/productModel');
const User = require('./models/userModel');
const CartItem = require('./models/cartItemModel');
const Cart = require('./models/cartModel');
const OrderItem = require('./models/orderItemModel');
const Order = require('./models/orderModel');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));
app.use(express.static('./public'));

app.use(async (req, res, next) => {
	try {
		const user = await User.findByPk(1);
		req.user = user;
		next();
	} catch (error) {
		console.log(error);
	}
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

User.hasMany(Product);
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

User.hasMany(Order);
Order.belongsTo(User);

Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

const startingServerWithUser = async () => {
	// .sync({ force: true })
	try {
		await sequelize.sync();
		const user = await User.findByPk(1);
		if (!user) {
			await User.create({ name: 'Kato', email: 'kato@kato.com' });
		}
		await user.createCart();
		app.listen(8888);
	} catch (error) {
		console.log(error);
	}
};
startingServerWithUser()