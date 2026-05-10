const express = require('express');
const router = express.Router();
const { submitContact, getContacts } = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', submitContact);
router.get('/', protect, authorize('admin'), getContacts);

module.exports = router;
