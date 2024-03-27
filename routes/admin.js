import express from 'express';
import {
	getAddProduct,
	postAddProduct,
	getAdminProducts,
	getEditProduct,
	postEditProduct,
	postDeleteProduct
} from '../controllers/adminController.js';
import isAuth from '../middleware/isAuth.js';
import { addProductValidator } from '../util/validators.js';
const adminRouter = express.Router();

// admin/add-product => GET
adminRouter.get('/add-product',isAuth, getAddProduct);
adminRouter.get('/products', isAuth, getAdminProducts);
adminRouter.get('/edit-product/:productId', isAuth, getEditProduct);
adminRouter.post('/edit-product', isAuth, addProductValidator, postEditProduct);
adminRouter.post('/add-product', isAuth, addProductValidator, postAddProduct);
adminRouter.post('/delete-product', isAuth, postDeleteProduct);

export default adminRouter;
