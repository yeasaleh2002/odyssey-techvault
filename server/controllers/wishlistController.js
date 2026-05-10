const User = require('../models/User');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    
    res.status(200).json({
      success: true,
      data: user.wishlist.filter(p => p != null)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle item in wishlist
// @route   POST /api/wishlist
// @access  Private
exports.toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user.id);
    
    const index = user.wishlist.indexOf(productId);
    
    if (index > -1) {
      // Remove
      user.wishlist.splice(index, 1);
    } else {
      // Add
      user.wishlist.push(productId);
    }
    
    await user.save();
    const updatedUser = await User.findById(req.user.id).populate('wishlist');

    res.status(200).json({
      success: true,
      data: updatedUser.wishlist.filter(p => p != null)
    });
  } catch (error) {
    next(error);
  }
};
