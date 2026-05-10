const express = require('express');
const {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createOrder)
  .get(getUserOrders);

router.route('/all')
  .get(authorize('admin'), getAllOrders);

router.route('/:id')
  .get(getOrderById);

router.route('/:id/status')
  .put(authorize('admin'), updateOrderStatus);

router.route('/:id/cancel')
  .put(cancelOrder);

module.exports = router;
