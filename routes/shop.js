import * as express from 'express';
import {
	getIndex,
	getProducts,
	getProduct,
	getCart,
	postCart,
	postDeleteCart,
	getOrders,
	getInvoice,
	postOrder,
	getCheckout
} from '../controllers/shopController.js';
import isAuth from '../middleware/isAuth.js';

const shopRouter = express.Router();

shopRouter.get('/', getIndex);
shopRouter.get('/products/:productId', getProduct);
shopRouter.get('/products', getProducts);
shopRouter.get('/cart', isAuth, getCart);
shopRouter.get('/orders/:orderId', isAuth, getInvoice)
shopRouter.get('/orders', isAuth, getOrders);
shopRouter.get('/checkout/success', isAuth, postOrder);
shopRouter.get('/checkout/cancel', isAuth, getCheckout);
shopRouter.get('/checkout', isAuth, getCheckout)
shopRouter.post('/cart', isAuth, postCart);
shopRouter.post('/cart-delete-item', isAuth, postDeleteCart);

export default shopRouter;
