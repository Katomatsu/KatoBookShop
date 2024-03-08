const express = require('express')
const adminController = require('../controllers/adminController');

const router = express.Router()



// admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);
router.get('/products', adminController.getAdminProducts);
router.get('/edit-product', adminController.getEditProduct)
router.post('/add-product', adminController.postAddProduct);

module.exports = router;