const Product = require('../models/productModel');

exports.getIndex = async (req, res, next) => {
	try {
		const products = await Product.fetchAll();
		res.render('shop/index', {
			pageTitle: 'All Products',
			products: products,
			path: '/'
		});
	} catch (error) {
		console.log(error);
	}
};

exports.getProducts = async (req, res, next) => {
	try {
		const products = await Product.fetchAll();
		res.render('shop/productsList', {
			pageTitle: 'All Products',
			products: products,
			path: '/'
		});
	} catch (error) {
		console.log(error);
	}
};

exports.getProduct = async (req, res, next) => {
	try {
		const prodId = req.params.productId;
		const product = await Product.findById(prodId);
		res.render('shop/productDetails', {
			pageTitle: product.title,
			path: '/products',
			product: product
		});
	} catch (error) {
		console.log(error);
	}
};

exports.getCart = async (req, res, next) => {
	try {
		const products = await req.user.fetchCart();
		res.render('shop/cart', {
			pageTitle: 'Your Cart',
			path: '/cart',
			products: products,
			totalPrice: 0 /* cart.totalPrice */
		});
	} catch (error) {
		console.log(error);
	}
};

exports.postCart = async (req, res, next) => {
	try {
		const prodId = req.body.productId;

		const product = await Product.findById(prodId);
		await req.user.addToCart(product);
		res.redirect('/cart');
	} catch (error) {
		console.log(error);
	}
};

exports.postDeleteCart = async (req, res, next) => {
	try {
		const prodId = req.body.productId;
		await req.user.deleteCartItem(prodId);
		res.redirect('/cart');
	} catch (error) {
		console.log(error);
	}
};

exports.getOrders = async (req, res, next) => {
	try {
		const orders = await req.user.fetchOrders();
		res.render('shop/orders', {
			pageTitle: 'Your Orders',
			path: '/orders',
			orders: orders
		});
	} catch (error) {
		console.log(error);
	}
};

exports.postOrder = async (req, res, next) => {
	try {
		await req.user.addOrder();
		res.redirect('/orders');
	} catch (error) {
		console.log(error);
	}
};
