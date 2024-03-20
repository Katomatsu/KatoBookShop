const Product = require('../models/productModel');

exports.getAddProduct = (req, res, next) => {
	res.render('admin/editProduct', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editing: false
	});
};

exports.postAddProduct = async (req, res, next) => {
	try {
    const user = req.user
		const title = req.body.title;
		const price = req.body.price;
		const imageUrl = req.body.imageUrl;
		const description = req.body.description;
		const product = new Product(title, price, imageUrl, description, user._id);
		await product.save();
		res.redirect('/admin/products');
	} catch (error) {
		console.log(error);
	}
};

exports.getEditProduct = async (req, res, next) => {
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
			product: product
		});
	} catch (error) {
		console.log(error);
	}
};

exports.postEditProduct = async (req, res, next) => {
	try {
		const prodId = req.body.id;
		const updatedTitle = req.body.title;
		const updatedPrice = req.body.price;
		const updatedDescription = req.body.description;
		const updatedImageUrl = req.body.imageUrl;

		await Product.updateProduct(prodId, {
			title: updatedTitle,
			price: updatedPrice,
			description: updatedDescription,
			imageUrl: updatedImageUrl 
		});
		res.redirect('/admin/products');
	} catch (error) {
		console.log(error);
	}
};

exports.getAdminProducts = async (req, res, next) => {
	try {
		const products = await Product.fetchAll();
		res.render('admin/adminProducts', {
			pageTitle: 'Admin Products',
			path: '/admin/products',
			products
		});
	} catch (error) {
		console.log(error);
	}
};

exports.postDeleteProduct = async (req, res, next) => {
	try {
		const prodId = req.body.id;
		if (!prodId) {
			throw new Error('Cannot find product ID');
		}
		await Product.deleteProduct(prodId, req.user);
		res.redirect('/admin/products');
	} catch (error) {
		console.log(error);
	}
};
