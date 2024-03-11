const Product = require('../models/productModel');
const Cart = require('../models/cartModel');

exports.getIndex = (req, res, next) => {
	Product.fetchAll().then(([products /* fieldsData */]) => {
		console.log('shop.js', products);
		res.render('shop/index', {
			pageTitle: 'All Products',
			products: products,
			path: '/',
			hasProducts: products.length > 0
		});
	}).catch((err) => {
    console.log(err);
  });
};

exports.getProducts = (req, res, next) => {
	Product.fetchAll().then(([products /* fieldsData */]) => {
    console.log('shop.js', products);
    res.render('shop/productsList', {
      pageTitle: 'Shop',
      products: products,
      path: '/products',
      hasProducts: products.length > 0
    });
  }).catch((err) => {
    console.log(err);
  });
};

exports.getProduct = (req, res, next) => {
	const prodId = req.params.productId;
	Product.findById(prodId).then(([product /* productFieldsData */]) => {
    res.render('shop/productDetails', {
		pageTitle: product[0].title,
		path: '/products',
		product: product[0]
	});
  }).catch((err) => {
    console.log(err);
  });
};

exports.getCart = (req, res, next) => {
	Cart.fetchCart(cart => {
		Product.fetchAll(products => {
			const cartProducts = [];
			for (const product of products) {
				const cartProductData = cart.products.find(
					prod => product.id === prod.id
				);
				if (cartProductData) {
					cartProducts.push({
						productData: product,
						quantity: cartProductData.quantity
					});
				}
			}
			res.render('shop/cart', {
				pageTitle: 'Your Cart',
				path: '/cart',
				products: cartProducts,
				totalPrice: cart.totalPrice
			});
		});
	});
};

exports.postCart = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findById(prodId, product => {
		Cart.addProduct(prodId, product.price);
	});
	res.redirect('/cart');
};

exports.postDeleteCart = (req, res, next) => {
	const id = req.body.id;
	Product.findById(id, product => {
		Cart.deleteProductFromCart(id, product.price);
	});
	res.redirect('/cart');
};

exports.getOrders = (req, res, next) => {
	res.render('shop/orders', {
		pageTitle: 'Your Orders',
		path: '/orders'
	});
};

exports.getCheckout = (req, res, next) => {
	res.render('shop/checkout', {
		pageTitle: 'Checkout',
		path: '/checkout'
	});
};
