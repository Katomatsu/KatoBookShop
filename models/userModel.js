import { Schema, model } from 'mongoose';

const userSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	cart: {
		items: [
			{
				productId: {
					type: Schema.Types.ObjectId,
					ref: 'Product',
					required: true
				},
				quantity: { type: Number, required: true }
			}
		]
	}
});

userSchema.methods.addToCart = async function (product) {
	try {
		const existingCartProductIndex = this.cart.items.findIndex(item => {
			return item.productId.toString() === product._id.toString();
		});
		const updatedCartItems = [...this.cart.items];
		let newQuantity = 1;

		if (existingCartProductIndex === -1) {
			updatedCartItems.push({
				productId: product._id,
				quantity: newQuantity
			});
		} else {
			newQuantity =
				updatedCartItems[existingCartProductIndex].quantity + 1;
			updatedCartItems[existingCartProductIndex].quantity = newQuantity;
		}

		const updatedCart = {
			items: updatedCartItems
		};

		this.cart = updatedCart;
		await this.save();
	} catch (error) {
		console.log(error);
	}
};

userSchema.methods.deleteCartItem = async function (productId) {
	try {
		const updatedCartItems = this.cart.items.filter(cartItem => {
			return cartItem.productId.toString() !== productId.toString();
		});
		this.cart = { items: [...updatedCartItems] };
		await this.save();
	} catch (error) {
		console.log(error);
	}
};

userSchema.methods.clearCart = async function() {
  this.cart = {items: []}
  this.save()
}

const UserModel = model('User', userSchema);

export default UserModel;

// const { getDb } = require('../util/database');
// const convertToObjectId = require('../util/convertId');
// const { findById } = require('./productModel');

// class User {
// 	constructor(username, email, cart, id) {
// 		this.name = username;
// 		this.email = email;
// 		this.cart = cart; // {items: [{product, quantity}]}
// 		this._id = id;
// 	}
// 	async save() {
// 		try {
// 			const db = getDb();
// 			await db.collection('users').insertOne(this);
// 		} catch (error) {
// 			console.log(error);
// 		}
// 	}

// 	async addToCart(product) {
// 		try {
// 			const db = getDb();
// 			const existingCartProductIndex = this.cart.items.findIndex(item => {
// 				return item.productId.toString() === product._id.toString();
// 			});
// 			const updatedCartItems = [...this.cart.items];
// 			let newQuantity = 1;

// 			if (existingCartProductIndex === -1) {
// 				updatedCartItems.push({
// 					productId: product._id,
// 					quantity: newQuantity
// 				});
// 			} else {
// 				newQuantity =
// 					updatedCartItems[existingCartProductIndex].quantity + 1;
// 				updatedCartItems[existingCartProductIndex].quantity =
// 					newQuantity;
// 			}

// 			await db
// 				.collection('users')
// 				.updateOne(
// 					{ _id: this._id },
// 					{ $set: { 'cart.items': updatedCartItems } }
// 				);
// 		} catch (error) {
// 			console.log(error);
// 		}
// 	}

// 	async fetchCart() {
// try {
// 	const db = getDb();
// 	const productsIds = [];
// 	const quantities = {};

// 	this.cart.items.map(item => {
// 		productsIds.push(item.productId);
// 		quantities[item.productId] = item.quantity;
// 	});

// 	const products = await db
// 		.collection('products')
// 		.find({ _id: { $in: productsIds } })
// 		.toArray();

// 	return products.map(product => {
// 		return {
// 			...product,
// 			quantity: quantities[product._id]
// 		};
// 	});
// } catch (error) {
// 	console.log(error);
// }
// 	}

// 	async fetchOrders() {
// 		try {
// 			const db = getDb();
// 			return await db
// 				.collection('orders')
// 				.find({ 'user._id': this._id })
// 				.toArray();
// 		} catch (error) {
// 			console.log(error);
// 		}
// 	}

// 	async addOrder() {
// 		try {
// 			const db = getDb();
// 			const prodsFromCart = await this.fetchCart();

// 			const order = {
// 				items: prodsFromCart,
// 				user: { _id: this._id, name: this.name, email: this.email }
// 			};
// 			await db.collection('orders').insertOne(order);

// 			const newCart = { items: [] };
// 			await db
// 				.collection('users')
// 				.updateOne(
// 					{ _id: this._id },
// 					{ $set: { cart: { items: newCart.items } } }
// 				);
// 		} catch (error) {
// 			console.log(error);
// 		}
// 	}

// 	static async findById(userId) {
// 		try {
// 			const db = getDb();
// 			return await db
// 				.collection('users')
// 				.findOne({ _id: convertToObjectId(userId) });
// 		} catch (error) {
// 			console.log(error);
// 		}
// 	}
// 	async deleteCartItem(prodId) {
// 		try {
// 			const updatedCartItems = this.cart.items.filter(cartItem => {
// 				return cartItem.productId.toString() !== prodId.toString();
// 			});
// 			const db = getDb();
// 			await db
// 				.collection('users')
// 				.updateOne(
// 					{ _id: this._id },
// 					{ $set: { cart: { items: updatedCartItems } } }
// 				);
// 		} catch (error) {
// 			console.log(error);
// 		}
// 	}
// }
// module.exports = User;
