import * as express from 'express';
import {
	getIndex,
	getProducts,
	getProduct,
	getCart,
	postCart,
	postDeleteCart,
	getOrders,
	postOrder
} from '../controllers/shopController.js';

const shopRouter = express.Router();

shopRouter.get('/', getIndex);
shopRouter.get('/products', getProducts);
shopRouter.get('/products/:productId', getProduct);
shopRouter.get('/cart', getCart);
shopRouter.post('/cart', postCart)
shopRouter.post('/cart-delete-item', postDeleteCart)
shopRouter.get('/orders', getOrders);
shopRouter.post('/create-order', postOrder)

export default shopRouter;
