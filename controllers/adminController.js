const Product = require('../models/productModel');

exports.getAddProduct = (req, res, next) => {
	res.render('admin/addProduct', {
		pageTitle: 'Add Product',
		path: '/admin/add-product'
	});
};

exports.postAddProduct = (req, res, next) => {
	const title = req.body.title;
	const price = req.body.price;
	const description = req.body.description;
	const imageUrl = req.body.imageUrl;
	const product = new Product(title, price, description, imageUrl);
	product.save();
	res.redirect('/');
};

exports.getAdminProducts = (req, res, next) => {
  Product.fetchAll(products => {
		res.render('admin/adminProducts', {
			pageTitle: 'Admin Products',
			path: '/admin/products',
			products
		});
	});

};

exports.getEditProduct = (req, res, next) => {
  res.render('admin/editProduct', {
    pageTitle: 'Edit Product',
    path: '/admin/edit-product'
  })
}
