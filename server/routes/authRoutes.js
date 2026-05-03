const express = require('express');
const { register, login, refresh, logout, getMe, getUsersCount } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.get('/users', getUsersCount);

module.exports = router;
