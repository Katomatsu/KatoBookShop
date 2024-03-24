import express from 'express';
import {
	getAddProduct,
	postAddProduct,
	getAdminProducts,
	getEditProduct,
	postEditProduct,
	postDeleteProduct,
} from '../controllers/adminController.js';

const adminRouter = express.Router();

// admin/add-product => GET
adminRouter.get('/add-product', getAddProduct);
adminRouter.get('/products', getAdminProducts);
adminRouter.get('/edit-product/:productId', getEditProduct);
adminRouter.post('/edit-product', postEditProduct);
adminRouter.post('/add-product', postAddProduct);
adminRouter.post('/delete-product', postDeleteProduct);

export default adminRouter;
