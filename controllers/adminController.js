const Product = require('../models/productModel');


exports.getAddProduct = (req, res, next) => {
	res.render('admin/editProduct', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
    editing: false
	});
};

exports.postAddProduct = (req, res, next) => {
	const title = req.body.title;
	const price = req.body.price;
	const description = req.body.description;
	const imageUrl = req.body.imageUrl;
	const product = new Product(null, title, price, description, imageUrl);
	product.save();
	res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit;
	const prodId = req.params.productId;
	if (!editMode) {
		return res.redirect('/');
	}

	Product.findById(prodId, product => {
		if (!product) {
			return res.redirect('/');
		}

		res.render('admin/editProduct', {
			pageTitle: 'Edit Product',
			path: '/admin/edit-product',
			editing: editMode,
			product
		});
	});
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.id
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  const updatedImageUrl = req.body.imageUrl;
  const updatedProduct = new Product(prodId, updatedTitle, updatedPrice, updatedDescription, updatedImageUrl);
  updatedProduct.save();
  res.redirect('/admin/products');
}

exports.getAdminProducts = (req, res, next) => {
	Product.fetchAll(products => {
		res.render('admin/adminProducts', {
			pageTitle: 'Admin Products',
			path: '/admin/products',
			products
		});
	});
};

exports.postDeleteProduct = (req, res, next) => {
  Product.deleteProduct(req.body.id)
  res.redirect('/admin/products')
}