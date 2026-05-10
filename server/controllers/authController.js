const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate Tokens
const generateTokens = (id) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '15m' // short life
  });
  const refreshToken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d' // long life
  });
  return { accessToken, refreshToken };
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, adminSecret } = req.body;

    // Check if user exists
    let userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, error: 'Email already exists' });
    }
    


    // Determine role
    let userRole = 'user';
    if (role === 'admin') {
      if (adminSecret === (process.env.ADMIN_REGISTRATION_SECRET || 'odyssey_admin_2024')) {
        userRole = 'admin';
      } else {
        return res.status(403).json({ success: false, error: 'Invalid admin secret' });
      }
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: userRole
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Save refresh token to db
    user.refreshToken = refreshToken;
    await user.save();

    // Send cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(201).json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(200).json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
exports.refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ success: false, error: 'Not authorized, no refresh token' });
    }

    // Verify token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ success: false, error: 'Not authorized, token failed' });
    }

    // Issue new access token
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '15m'
    });

    res.status(200).json({
      success: true,
      accessToken
    });
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Not authorized, token failed' });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
exports.logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET, { ignoreExpiration: true });
      if (decoded && decoded.id) {
         await User.findByIdAndUpdate(decoded.id, { refreshToken: null });
      }
    }
  } catch (err) {
    // ignore verify errors
  }

  res.clearCookie('refreshToken');
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get total users count
// @route   GET /api/auth/users
// @access  Public
exports.getUsersCount = async (req, res, next) => {
  try {
    const count = await User.countDocuments();
    res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    next(error);
  }
};
