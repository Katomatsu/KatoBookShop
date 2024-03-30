import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';
import throwTechError from '../util/throwTechError.js';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

export const getIndex = async (req, res, next) => {
	try {
		const { page } = req.query;
		const products = await Product.find();
		res.render('shop/index', {
			pageTitle: 'All Products',
			products: products,
			path: '/'
		});
	} catch (error) {
		throwTechError(error, next);
	}
};

export const getProducts = async (req, res, next) => {
	try {
		const products = await Product.find();
		res.render('shop/productsList', {
			pageTitle: 'All Products',
			products: products,
			path: '/products'
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
			products: products,
			totalPrice: 0 /* cart.totalPrice */
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
