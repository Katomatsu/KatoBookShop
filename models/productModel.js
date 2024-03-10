const fs = require('fs');
const path = require('path');
const Cart = require('../models/cartModel');

const p = path.join(
	path.dirname(require.main.filename),
	'data',
	'products.json'
);

const getProductsFromFile = cb => {
	fs.readFile(p, (err, fileContent) => {
		if (err) {
			cb([]);
		} else {
			cb(JSON.parse(fileContent));
		}
	});
};

module.exports = class Product {
	constructor(id, title, price, description, imageUrl) {
		this.id = id;
		this.title = title;
		this.price = price;
		this.description = description;
		this.imageUrl = imageUrl;
	}

	save() {
		getProductsFromFile(products => {
			if (this.id) {
				const existingProductIndex = products.findIndex(
					product => product.id === this.id
				);
				console.log('object1');
				const updatedProducts = [...products];
				updatedProducts[existingProductIndex] = this;

				fs.writeFile(p, JSON.stringify(updatedProducts), err => {
					console.log(err, 'this is error');
				});
			} else {
				this.id = Math.random().toString();
				console.log('object');
				products.push(this);
				fs.writeFile(p, JSON.stringify(products), err => {
					console.log(err);
				});
			}
		});
	}

	static deleteProduct(id) {
		getProductsFromFile(products => {
      const product = products.find(item => item.id === id)
			const updatedProducts = products.filter(product => {
				return product.id !== id;
			});
			fs.writeFile(p, JSON.stringify(updatedProducts), err => {
        if (!err) {
          Cart.deleteProductFromCart(id, product.price);
        } else {
          console.log(err);
        }
			});
		});
	}

	static fetchAll(cb) {
		getProductsFromFile(cb);
	}

	static findById(id, cb) {
		getProductsFromFile(products => {
			const product = products.find(item => item.id === id);
			cb(product);
		});
	}
};
