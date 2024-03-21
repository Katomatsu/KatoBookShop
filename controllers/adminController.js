import Product from '../models/productModel.js'

export const getAddProduct = (req, res, next) => {
	res.render('admin/editProduct', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		editing: false
	});
};

export const postAddProduct = async (req, res, next) => {
	try {
		const title = req.body.title;
		const price = req.body.price;
		const imageUrl = req.body.imageUrl;
		const description = req.body.description;

		const product = new Product({title, price, imageUrl, description, userId: req.user});
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
			product: product
		});
	} catch (error) {
		console.log(error);
	}
};

export const postEditProduct = async (req, res, next) => {
	try {
		const prodId = req.body.productId;
		const updatedTitle = req.body.title;
		const updatedPrice = req.body.price;
		const updatedDescription = req.body.description;
		const updatedImageUrl = req.body.imageUrl;

		await Product.updateOne({_id: prodId}, {
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

export const getAdminProducts = async (req, res, next) => {
	try {
		// you can also use useful methods after 'find': Product.find().select('title price -_id').populate('userId', 'name')
		const products = await Product.find();
		console.log(products);
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
		await Product.findByIdAndDelete(prodId);
		res.redirect('/admin/products');
	} catch (error) {
		console.log(error);
	}
};
