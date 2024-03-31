import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';
import throwTechError from '../util/throwTechError.js';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
config();
import PDFDocument from 'pdfkit';
import { Stripe } from 'stripe';
const ITEMS_PER_PAGE = 9;

const stripe = new Stripe(process.env.STRIPE_API_KEY);

export const getIndex = async (req, res, next) => {
	try {
		const page = +req.query.page || 1;
		const productsCount = await Product.find().countDocuments();

		const products = await Product.find()
			.skip((page - 1) * ITEMS_PER_PAGE)
			.limit(ITEMS_PER_PAGE);

		res.render('shop/index', {
			pageTitle: 'All Products',
			products: products,
			path: '/',
			currentPage: page,
			hasNextPage: ITEMS_PER_PAGE * page < productsCount,
			hasPrevPage: page > 1,
			nextPage: page + 1,
			prevPage: page - 1,
			lastPage: Math.ceil(productsCount / ITEMS_PER_PAGE)
		});
	} catch (error) {
		throwTechError(error, next);
	}
};

export const getProducts = async (req, res, next) => {
	try {
		const page = +req.query.page || 1;
		const productsCount = await Product.find().countDocuments();
		const products = await Product.find()
			.skip((page - 1) * ITEMS_PER_PAGE)
			.limit(ITEMS_PER_PAGE);
		res.render('shop/productsList', {
			pageTitle: 'All Products',
			products: products,
			path: '/products',
			currentPage: page,
			hasNextPage: ITEMS_PER_PAGE * page < productsCount,
			hasPrevPage: page > 1,
			nextPage: page + 1,
			prevPage: page - 1,
			lastPage: Math.ceil(productsCount / ITEMS_PER_PAGE)
		});
	} catch (error) {
		throwTechError(error, next);
	}
};

export const getProduct = async (req, res, next) => {
	try {
		const prodId = req.params.productId;
		const product = await Product.findById(prodId);
		res.render('shop/productDetails', {
			pageTitle: product.title,
			path: '/products',
			product: product
		});
	} catch (error) {
		throwTechError(error, next);
	}
};

export const getCart = async (req, res, next) => {
	try {
		const user = await req.user.populate('cart.items.productId');
		const products = user.cart.items;
		// console.log(products);
		res.render('shop/cart', {
			pageTitle: 'Your Cart',
			path: '/cart',
			products: products
		});
	} catch (error) {
		throwTechError(error, next);
	}
};

export const postCart = async (req, res, next) => {
	try {
		const prodId = req.body.productId;

		const product = await Product.findById(prodId);
		await req.user.addToCart(product);
		res.redirect('/cart');
	} catch (error) {
		throwTechError(error, next);
	}
};

export const postDeleteCart = async (req, res, next) => {
	try {
		const prodId = req.body.productId;
		await req.user.deleteCartItem(prodId);
		res.redirect('/cart');
	} catch (error) {
		throwTechError(error, next);
	}
};

export const getCheckout = async (req, res, next) => {
	const user = await req.user.populate('cart.items.productId');
	const products = user.cart.items;
	const total = products.reduce((acc, curr) => {
		return acc + curr.productId.price * curr.quantity;
	}, 0);

	const session = await stripe.checkout.sessions.create({
		payment_method_types: ['card'],
		line_items: products.map(p => {
			return {
				price_data: {
					currency: 'usd',
					unit_amount: parseInt(Math.ceil(p.productId.price * 100)),
					product_data: {
						name: p.productId.title,
						description: p.productId.description
					}
				},
				quantity: p.quantity
			};
		}),
		mode: 'payment',
		success_url: `${req.protocol}://${req.get('host')}/checkout/success`, // ${req.protocol}://${req.get('host')} => http://localhost:8888
		cancel_url: `${req.protocol}://${req.get('host')}/checkout/cancel`
	});

	res.render('shop/checkout', {
		pageTitle: 'Checkout',
		path: '/checkout',
		products,
		totalSum: total,
		sessionId: session.id
	});
};

export const getOrders = async (req, res, next) => {
	try {
		const orders = await Order.find({ 'user.userId': req.user._id });
		res.render('shop/orders', {
			pageTitle: 'Your Orders',
			path: '/orders',
			orders: orders
		});
	} catch (error) {
		throwTechError(error, next);
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
				email: req.user.email,
				userId: req.user
			}
		});
		await order.save();
		await req.user.clearCart();
		res.redirect('/orders');
	} catch (error) {
		throwTechError(error, next);
	}
};

export const getInvoice = async (req, res, next) => {
	try {
		const orderId = req.params.orderId;
		const order = await Order.findById({ _id: orderId });
		let totalPrice = 0;

		if (!order) {
			return next(new Error('No order found.'));
		}
		if (order.user.userId.toString() !== req.user._id.toString()) {
			return next(new Error('Unauthorized!'));
		}
		const invoiceName = `invoice-${orderId}.pdf`;
		const invoicePath = path.join('data', 'invoices', invoiceName);

		res.setHeader('Content-Type', 'application/pdf');
		res.setHeader('Content-Disposition', `inline; filename=${invoiceName}`);

		const pdfDoc = new PDFDocument();
		pdfDoc.pipe(fs.createWriteStream(invoicePath));
		pdfDoc.pipe(res);
		pdfDoc.fontSize(26).text('Invoice', {
			underline: true
		});
		pdfDoc.text('-----------------------------------------');

		order.products.forEach(prod => {
			totalPrice += prod.quantity * prod.product.price;
			pdfDoc
				.fontSize(14)
				.text(
					`${prod.product.title} - ${prod.quantity} × ${prod.product.price}`
				);
		});
		pdfDoc.text('------');
		pdfDoc.fontSize(20).text(`Total Price: $ ${totalPrice}`);
		pdfDoc.end();

		// fs.readFile(invoicePath, (err, data) => {
		// 	if (err) {
		// 		return next(err);
		// 	}
		// res.setHeader('Content-Type', 'application/pdf');
		// res.setHeader(
		// 	'Content-Disposition',
		// 	`inline; filename=${invoiceName}`
		// );
		// 	res.send(data);
		// });
		// const file = fs.createReadStream(invoicePath);
		// file.pipe(res)
	} catch (error) {
		return next(error);
	}
};
