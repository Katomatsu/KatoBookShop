import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';

export const getIndex = async (req, res, next) => {
	try {
		const products = await Product.find();
		res.render('shop/index', {
			pageTitle: 'All Products',
			products: products,
			path: '/',
			isAuthenticated: req.session.isLoggedIn
		});
	} catch (error) {
		console.log(error);
	}
};

export const getProducts = async (req, res, next) => {
	try {
		const products = await Product.find();
		res.render('shop/productsList', {
			pageTitle: 'All Products',
			products: products,
			path: '/',
			isAuthenticated: req.session.isLoggedIn
		});
	} catch (error) {
		console.log(error);
	}
};

export const getProduct = async (req, res, next) => {
	try {
		const prodId = req.params.productId;
		const product = await Product.findById(prodId);
		res.render('shop/productDetails', {
			pageTitle: product.title,
			path: '/products',
			product: product,
			isAuthenticated: req.session.isLoggedIn
		});
	} catch (error) {
		console.log(error);
	}
};

export const getCart = async (req, res, next) => {
	try {
    const user = await req.user.populate('cart.items.productId')
		const products = user.cart.items;
    // console.log(products);
		res.render('shop/cart', {
			pageTitle: 'Your Cart',
			path: '/cart',
			products: products,
			isAuthenticated: req.session.isLoggedIn,

			totalPrice: 0 /* cart.totalPrice */
		});
	} catch (error) {
		console.log(error);
	}
};

export const postCart = async (req, res, next) => {
	try {
		const prodId = req.body.productId;

		const product = await Product.findById(prodId);
		await req.user.addToCart(product);
		res.redirect('/cart');
	} catch (error) {
		console.log(error);
	}
};

export const postDeleteCart = async (req, res, next) => {
	try {
		const prodId = req.body.productId;
		await req.user.deleteCartItem(prodId);
		res.redirect('/cart');
	} catch (error) {
		console.log(error);
	}
};

export const getOrders = async (req, res, next) => {
	try {
		const orders = await Order.find({ 'user.userId': req.user._id });
		res.render('shop/orders', {
			pageTitle: 'Your Orders',
			path: '/orders',
			orders: orders,
			isAuthenticated: req.session.isLoggedIn
		});
	} catch (error) {
		console.log(error);
	}
};

export const postOrder = async (req, res, next) => {
	try {
		const user = await req.user.populate('cart.items.productId');
		const products = user.cart.items.map(prod => {
			return {
				product: { ...prod.productId._doc },
				quantity: prod.quantity
			};
		});
		const order = new Order({
			products,
			user: {
				name: req.user.name,
				userId: req.user
			}
		});
		await order.save();
		await req.user.clearCart();
		res.redirect('/orders');
	} catch (error) {
		console.log(error);
	}
};
