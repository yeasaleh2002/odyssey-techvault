const User = require('../models/User');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    
    if (!user.wishlist) user.wishlist = [];

    res.status(200).json({
      success: true,
      data: user.wishlist.filter(p => p != null)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle item in wishlist (add if not present, remove if present)
// @route   POST /api/wishlist
// @access  Private
exports.toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user.wishlist) user.wishlist = [];

    const index = user.wishlist.findIndex(id => id.toString() === productId);
    
    if (index > -1) {
      user.wishlist.splice(index, 1);
    } else {
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

// @desc    Remove specific item from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.wishlist) user.wishlist = [];

    user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.productId);
    
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
