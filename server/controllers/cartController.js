const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.product');
    
    // Filter out null products (in case a product was deleted)
    const validCartItems = user.cart.filter(item => item.product != null);
    
    res.status(200).json({
      success: true,
      data: validCartItems
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const user = await User.findById(req.user.id);
    
    // Check if item exists in cart
    const itemIndex = user.cart.findIndex(p => p.product.toString() === productId);

    if (itemIndex > -1) {
      // Product exists in the cart, update the quantity
      user.cart[itemIndex].quantity += quantity;
    } else {
      // Product does not exist in cart, add new item
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    
    const updatedUser = await User.findById(req.user.id).populate('cart.product');

    res.status(200).json({
      success: true,
      data: updatedUser.cart.filter(item => item.product != null)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart or update quantity
// @route   DELETE /api/cart/:productId
// @access  Private
exports.removeFromCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    user.cart = user.cart.filter(item => item.product.toString() !== req.params.productId);
    
    await user.save();
    
    const updatedUser = await User.findById(req.user.id).populate('cart.product');

    res.status(200).json({
      success: true,
      data: updatedUser.cart.filter(item => item.product != null)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = [];
    await user.save();
    
    res.status(200).json({
      success: true,
      data: []
    });
  } catch (error) {
    next(error);
  }
};
