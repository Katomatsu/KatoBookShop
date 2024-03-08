const Product = require('../models/productModel');

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    console.log('shop.js', products);
    res.render('shop/index', {
      pageTitle: 'All Products',
      products: products,
      path: '/',
      hasProducts: products.length > 0
    });
  });
};

exports.getProducts = (req, res, next) => {
	Product.fetchAll(products => {
		console.log('shop.js', products);
		res.render('shop/productsList', {
			pageTitle: 'Shop',
			products: products,
			path: '/products',
			hasProducts: products.length > 0
		});
	});
};


exports.getCart = (req, res, next) => {
	res.render('shop/cart', {
		pageTitle: 'Your Cart',
		path: '/cart'
	});
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Your Orders',
    path: '/orders'
  })
}

exports.getCheckout = (req, res, next) => {
	res.render('shop/checkout', {
		pageTitle: 'Checkout',
		path: '/checkout'
	});
};  