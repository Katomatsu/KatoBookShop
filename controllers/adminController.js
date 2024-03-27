import { validationResult } from 'express-validator';
import Product from '../models/productModel.js';

export const getAddProduct = (req, res, next) => {
	res.render('admin/editProduct', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editing: false,
		hasError: false,
		errorMessage: null,
		validationErrors: []
	});
};

export const postAddProduct = async (req, res, next) => {
	try {
		const { title, price, imageUrl, description } = req.body;
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.log(errors.array());
			return res.status(422).render('admin/editProduct', {
				pageTitle: 'Add Product',
				path: '/admin/add-product',
				editing: false,
				hasError: true,
				errorMessage: errors.array()[0].msg,
				product: { title, price, imageUrl, description },
				validationErrors: errors.array()
			});
		}

		const product = new Product({
			title,
			price,
			imageUrl,
			description,
			userId: req.user
		});
		await product.save();
		res.redirect('/admin/products');
	} catch (error) {
		console.log(error);
	}
};

export const getEditProduct = async (req, res, next) => {
	try {
		const editMode = req.query.edit;
		const prodId = req.params.productId;
		if (!editMode) {
			return res.redirect('/');
		}

		const product = await Product.findById(prodId);
		if (!product) {
			return res.redirect('/');
		}
		res.render('admin/editProduct', {
			pageTitle: 'Edit Product',
			path: '/admin/edit-product',
			editing: editMode,
			product: product,
			hasError: false,
			errorMessage: null,
			validationErrors: []
		});
	} catch (error) {
		console.log(error);
	}
};

export const postEditProduct = async (req, res, next) => {
	try {
		const { productId, title, price, description, imageUrl } = req.body;
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.log(errors.array());
			return res.status(422).render('admin/editProduct', {
				pageTitle: 'Edit Product',
				path: '/admin/edit-product',
				editing: true,
				hasError: true,
				errorMessage: errors.array()[0].msg,
				validationErrors: errors.array(),
        product: {title, price, imageUrl, description, _id: productId}
			});
		}

		const result = await Product.updateOne(
			{ _id: productId, userId: req.user._id },
			{
				title,
				price,
				description,
				imageUrl
			}
		);
		if (result.matchedCount === 0) {
			return res.redirect('/');
		}

		res.redirect('/admin/products');
	} catch (error) {
		console.log(error);
	}
};

export const getAdminProducts = async (req, res, next) => {
	try {
		// you can also use useful methods after 'find': Product.find().select('title price -_id').populate('userId', 'name')
		const products = await Product.find({ userId: req.user._id });
		// console.log(products);

		res.render('admin/adminProducts', {
			pageTitle: 'Admin Products',
			path: '/admin/products',
			products
		});
	} catch (error) {
		console.log(error);
	}
};

// don't forget to remove product also from cart!!!!
export const postDeleteProduct = async (req, res, next) => {
	try {
		const prodId = req.body.id;
		if (!prodId) {
			throw new Error('Cannot find product ID');
		}
		await Product.deleteOne({ _id: prodId, userId: req.user._id });
		res.redirect('/admin/products');
	} catch (error) {
		console.log(error);
	}
};
