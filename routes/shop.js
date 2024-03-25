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
import isAuth from '../middleware/isAuth.js';

const shopRouter = express.Router();

shopRouter.get('/', getIndex);
shopRouter.get('/products', getProducts);
shopRouter.get('/products/:productId', getProduct);
shopRouter.get('/cart', isAuth, getCart);
shopRouter.post('/cart',isAuth,  postCart)
shopRouter.post('/cart-delete-item', isAuth, postDeleteCart)
shopRouter.get('/orders',isAuth,  getOrders);
shopRouter.post('/create-order',isAuth,  postOrder)

export default shopRouter;
