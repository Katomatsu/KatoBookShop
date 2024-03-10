const path = require('path');
const fs = require('fs');

const p = path.join(path.dirname(require.main.filename), 'data', 'cart.json');
module.exports = class Cart {
	static addProduct(id, productPrice) {
		fs.readFile(p, (err, fileContent) => {
			let cart = { products: [], totalPrice: 0 };
			if (!err) {
				cart = JSON.parse(fileContent);
			}

			// Searching for existing item
			const existingProductIndex = cart.products.findIndex(
				prod => prod.id === id
			);
			const existingProduct = cart.products[existingProductIndex];
			let updatedProduct;
			// Adding new item | increasing quantity
			if (existingProduct) {
				updatedProduct = {
					...existingProduct,
					quantity: existingProduct.quantity + 1
				};
				const updatedProducts = [...cart.products];
				updatedProducts[existingProductIndex] = updatedProduct;
				cart.products = [...updatedProducts];
			} else {
				updatedProduct = {
					id: id,
					quantity: 1
				};
				cart.products = [...cart.products, updatedProduct];
			}
			cart.totalPrice = cart.totalPrice + +productPrice;
			fs.writeFile(p, JSON.stringify(cart), err => {
				console.log(err);
			});
		});
	}

	static deleteProductFromCart(id, productPrice) {
		fs.readFile(p, (err, fileContent) => {
			if (err) {
				return;
			}

			const updatedCart = { ...JSON.parse(fileContent) };
			const product = updatedCart.products.find(
				product => product.id === id
			);

      if (!product) {
        return
      }

			updatedCart.products = updatedCart.products.filter(
				product => product.id !== id
			);

			updatedCart.totalPrice =
				updatedCart.totalPrice - productPrice * product.quantity;

			fs.writeFile(p, JSON.stringify(updatedCart), err => {
				console.log(err);
			});
		});
	}

	static fetchCart(cb) {
		fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
			if (err) {
				cb(null);
			} else {
				cb(cart);
			}
		});
	}
};
