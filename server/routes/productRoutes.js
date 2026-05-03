const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct
} = require('../controllers/productController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router
  .route('/')
  .get(getProducts)
  .post(protect, createProduct);

router
  .route('/:id')
  .get(getProduct)
  .delete(protect, deleteProduct);

module.exports = router;
