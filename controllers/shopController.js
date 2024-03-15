const Product = require('../models/productModel');

exports.getIndex = async (req, res, next) => {
	try {
		const products = await Product.findAll();
		res.render('shop/index', {
			pageTitle: 'All Products',
			products: products,
			path: '/',
			hasProducts: products.length > 0
		});
	} catch (error) {
		console.log(error);
	}
};

exports.getProducts = async (req, res, next) => {
	try {
		const products = await Product.findAll();
		res.render('shop/productsList', {
			pageTitle: 'All Products',
			products: products,
			path: '/',
			hasProducts: products.length > 0
		});
	} catch (error) {
		console.log(error);
	}
};

exports.getProduct = async (req, res, next) => {
	try {
		const prodId = req.params.productId;
		const product = awaitProduct.findByPk(prodId);
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
		const cart = await req.user.getCart();
		const cartProducts = await cart.getProducts();
		res.render('shop/cart', {
			pageTitle: 'Your Cart',
			path: '/cart',
			products: cartProducts,
			totalPrice: 0 /* cart.totalPrice */
		});
	} catch (error) {
		console.log(error);
	}
};

exports.postCart = async (req, res, next) => {
	try {
		const prodId = req.body.productId;
		const cart = await req.user.getCart();
		const products = await cart.getProducts({
			where: {
				id: prodId
			}
		});

		const manageProductAndQuantity = async () => {
			if (products.length > 0) {
				const product = products[0];
				const oldQuantity = product.cartItem.quantity;
				const newQuantity = oldQuantity + 1;
				return { product, quantity: newQuantity };
			} else {
				const product = await Product.findByPk(prodId);
				return { product, quantity: 1 };
			}
		};

		const { product, quantity } = await manageProductAndQuantity();
		await cart.addProduct(product, { through: { quantity } });
		await res.redirect('/cart');
	} catch (error) {
		console.log(error);
	}
};

exports.postDeleteCart = async (req, res, next) => {
	const prodId = req.body.productId;
	const cart = await req.user.getCart();
	const cartItem = await cart.getProducts({ where: { id: prodId } });
	await cart.removeProduct(cartItem);
	await res.redirect('/cart');
};

exports.getOrders = async (req, res, next) => {
	try {
		const orders = await req.user.getOrders({ include: ['products'] });
		console.log(orders);
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
		const cart = await req.user.getCart();
		const products = await cart.getProducts();
		const order = await req.user.createOrder();
		await order.addProducts(
			products.map(product => {
				product.orderItem = { quantity: product.cartItem.quantity };
				return product;
			})
		);
		await cart.removeProducts();
		await res.redirect('/orders');
	} catch (error) {
		console.log(error);
	}
};
