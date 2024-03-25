import { Schema, model } from 'mongoose';

const orderSchema = new Schema({
	products: [
		{
			product: {
				type: Object,
				required: true
			},
			quantity: { type: Number, required: true }
		}
	],
	user: {
		name: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true
		},
		userId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'User'
		}
	}
});

const orderModel = model('Order', orderSchema);

export default orderModel;
