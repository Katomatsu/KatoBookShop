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
		const title = req.body.title;
		const imageUrl = req.body.imageUrl;
		const price = req.body.price;
		const description = req.body.description;
		await req.user.createProduct({
			title: title,
			price: price,
			imageUrl: imageUrl,
			description: description
		});
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

		const products = await req.user.getProducts({ where: { id: prodId } });
		const product = products[0];
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
	const prodId = req.body.id;
	const updatedTitle = req.body.title;
	const updatedPrice = req.body.price;
	const updatedDescription = req.body.description;
	const updatedImageUrl = req.body.imageUrl;
	try {
		await Product.update(
			{
				title: updatedTitle,
				price: updatedPrice,
				description: updatedDescription,
				imageUrl: updatedImageUrl
			},
			{
				where: {
					id: prodId
				}
			}
		);
		res.redirect('/admin/products');
	} catch (error) {
		console.log(error);
	}
};

exports.getAdminProducts = async (req, res, next) => {
	try {
		const products = await req.user.getProducts();
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
	const prodId = req.body.id;
	try {
		await Product.destroy({
			where: {
				id: prodId
			}
		});
		res.redirect('/admin/products');
	} catch (error) {
		console.log(error);
	}
};
