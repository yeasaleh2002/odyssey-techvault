const express = require('express');
const { getWishlist, toggleWishlist, removeFromWishlist } = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getWishlist)
  .post(toggleWishlist);

router.route('/:productId')
  .delete(removeFromWishlist);

module.exports = router;
