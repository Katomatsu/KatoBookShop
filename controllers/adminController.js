import { validationResult } from 'express-validator';
import throwTechError from '../util/throwTechError.js';
import Product from '../models/productModel.js';
import deleteFile from '../util/deleteFile.js';

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
		const { title, price, description } = req.body;
		const image = req.file;
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(422).render('admin/editProduct', {
				pageTitle: 'Add Product',
				path: '/admin/add-product',
				editing: false,
				hasError: true,
				errorMessage: errors.array()[0].msg,
				product: { title, price, description },
				validationErrors: errors.array()
			});
		}
		if (!image) {
			return res.status(422).render('admin/editProduct', {
				pageTitle: 'Add Product',
				path: '/admin/add-product',
				editing: false,
				hasError: true,
				errorMessage: 'Attached file is not an image.',
				product: { title, price, description },
				validationErrors: []
			});
		}
		const imageUrl = image.filename;

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
		throwTechError(error, next);
	}
};

export const getEditProduct = async (req, res, next) => {
	const editMode = req.query.edit;
	const prodId = req.params.productId;
	if (!editMode) {
		return res.redirect('/');
	}
	try {
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
		throwTechError(error, next);
	}
};

export const postEditProduct = async (req, res, next) => {
	try {
		const { productId, title, price, description } = req.body;
		const image = req.file;
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
				product: { title, price, description, _id: productId }
			});
		}

		const product = await Product.findById(productId);
		product.title = title;
		product.price = price;
		product.description = description;
    if (!product) {
      return res.redirect('/');
    }
		if (image) {
      deleteFile(`images/${product.imageUrl}`);
			product.imageUrl = image.filename;
		}
    await product.save()
		res.redirect('/admin/products');
	} catch (error) {
		throwTechError(error, next);
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
		throwTechError(error, next);
	}
};

// don't forget to remove product also from cart!!!!
export const postDeleteProduct = async (req, res, next) => {
	try {
		const prodId = req.body.id;
		const product = await Product.findById(prodId);
		if (!product) {
			return next(new Error('Product not found'));
		}
		deleteFile(`images/${product.imageUrl}`);
		await Product.deleteOne({ _id: prodId, userId: req.user._id });
		res.redirect('/admin/products');
	} catch (error) {
		throwTechError(error, next);
	}
};
