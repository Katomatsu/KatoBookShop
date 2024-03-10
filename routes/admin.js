const express = require('express')
const adminController = require('../controllers/adminController');

const router = express.Router()



// admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);
router.get('/products', adminController.getAdminProducts);
router.get('/edit-product/:productId', adminController.getEditProduct)
router.post('/edit-product', adminController.postEditProduct)
router.post('/add-product', adminController.postAddProduct);
router.post('/delete-product', adminController.postDeleteProduct)

module.exports = router;