const express = require('express');
const { createOrder, getUserOrders, getAllOrders } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createOrder)
  .get(getUserOrders);

router.route('/all')
  .get(authorize('admin'), getAllOrders);

module.exports = router;
