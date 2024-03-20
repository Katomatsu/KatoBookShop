const { getDb } = require('../util/database');
const convertToObjectId = require('../util/convertId')
class Product {
	constructor(title, price, imageUrl, description, userId) {
		this.title = title;
		this.price = price;
		this.imageUrl = imageUrl;
		this.description = description;
    this.userId = userId
	}

	async save() {
		try {
			const db = getDb();
			await db.collection('products').insertOne(this);
		} catch (error) {
			console.log(error);
		}
	}

	static async fetchAll() {
		try {
			const db = getDb();
			return await db.collection('products').find().toArray();
		} catch (error) {
			console.log(error);
		}
	}

	static async findById(id) {
		try {
			const db = getDb();
			return await db
				.collection('products')
				.findOne({ _id: convertToObjectId(id) });
		} catch (error) {
			console.log(error);
		}
	}

	static async updateProduct(id, changedData) {
		try {
			const db = getDb();
			await db
				.collection('products')
				.updateOne(
					{ _id: convertToObjectId(id) },
					{ $set: changedData }
				);
		} catch (error) {
			console.log(error);
		}
	}

	static async deleteProduct(id, user) {
		try {
			const db = getDb();
			await db
				.collection('products')
				.deleteOne({ _id: convertToObjectId(id) });
      await user.deleteCartItem(convertToObjectId(id))
		} catch (error) {
			console.log(error);
		}
	}
}

module.exports = Product;
