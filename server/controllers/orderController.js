const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Create new order (saves to orders, then clears user cart)
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, error: 'No order items' });
    }

    // Save order to Orders collection tied to user
    const order = await Order.create({
      user: req.user.id,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || 'Credit Card'
    });

    // ✅ Clear the user's cart in DB ONLY after order is successfully saved
    await User.findByIdAndUpdate(req.user.id, { cart: [] });

    // Return populated order
    const populated = await Order.findById(order._id)
      .populate('items.product', 'title image price category');

    res.status(201).json({
      success: true,
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private
exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'title image price category')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private (owner or admin)
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'title image price category');

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    // Only owner or admin can view
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/all
// @access  Private/Admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'id name email')
      .populate('items.product', 'title image price category')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;

    const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ success: false, error: 'Invalid order status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    order.orderStatus = orderStatus;
    await order.save();

    const updated = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'title image price category');

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel an order (Owner or Admin)
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    // Only owner or admin can cancel
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized to cancel this order' });
    }

    if (order.orderStatus === 'Delivered') {
      return res.status(400).json({ success: false, error: 'Cannot cancel a delivered order' });
    }

    if (order.orderStatus === 'Cancelled') {
      return res.status(400).json({ success: false, error: 'Order is already cancelled' });
    }

    order.orderStatus = 'Cancelled';
    await order.save();

    const updated = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'title image price category');

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};
