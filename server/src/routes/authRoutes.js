const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authRateLimiter } = require('../middleware/auth');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../services/emailService');

// In-memory refresh token store or token check
const refreshTokens = new Set();

const generateTokens = (user) => {
  const accessSecret = process.env.JWT_SECRET || 'blaze_jwt_super_secret_access_token_key_2026';
  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'blaze_jwt_super_secret_refresh_token_key_2026';

  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
    name: user.name,
  };

  const accessToken = jwt.sign(payload, accessSecret, { expiresIn: '1h' });
  const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: '7d' });

  refreshTokens.add(refreshToken);

  return { accessToken, refreshToken };
};

// POST /register — create user, send verification email
router.post('/register', authRateLimiter, async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      isVerified: false,
      verificationToken,
      role: 'user',
    });

    await user.save();

    // Send verification email
    try {
      await sendVerificationEmail(user.email, verificationToken, user.name);
    } catch (mailErr) {
      console.error('[Blaze Auth] Could not send verification email:', mailErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
      verificationToken, // Provided in response to facilitate rapid local testing
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /verify-email/:token — verify email, activate account
router.get('/verify-email/:token', async (req, res, next) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Link expired or invalid verification token' });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.json({
      success: true,
      message: 'Email verified! You can now log in.',
    });
  } catch (err) {
    next(err);
  }
});

// POST /login — return JWT access + refresh tokens
router.post('/login', authRateLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email address before logging in. Check your inbox for the link.',
        unverified: true,
        email: user.email,
      });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    res.json({
      success: true,
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /refresh-token — issue new access token
router.post('/refresh-token', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'Refresh token required' });
    }

    const refreshSecret = process.env.JWT_REFRESH_SECRET || 'blaze_jwt_super_secret_refresh_token_key_2026';
    const accessSecret = process.env.JWT_SECRET || 'blaze_jwt_super_secret_access_token_key_2026';

    jwt.verify(refreshToken, refreshSecret, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ success: false, message: 'Invalid or expired refresh token' });
      }

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      const payload = {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      };

      const newAccessToken = jwt.sign(payload, accessSecret, { expiresIn: '1h' });

      res.json({
        success: true,
        accessToken: newAccessToken,
      });
    });
  } catch (err) {
    next(err);
  }
});

// POST /logout — invalidate refresh token
router.post('/logout', (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    refreshTokens.delete(refreshToken);
  }
  res.json({ success: true, message: 'Logged out successfully' });
});

// POST /forgot-password — send reset link email
router.post('/forgot-password', authRateLimiter, async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Do not leak user existence, return generic success
      return res.json({
        success: true,
        message: 'If an account exists with that email, a password reset link has been dispatched.',
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    try {
      await sendPasswordResetEmail(user.email, resetToken, user.name);
    } catch (mailErr) {
      console.error('[Blaze Auth] Could not send password reset email:', mailErr.message);
    }

    res.json({
      success: true,
      message: 'Password reset link sent to your email.',
      resetToken, // Included for convenient local testing
    });
  } catch (err) {
    next(err);
  }
});

// POST /reset-password/:token — update password
router.post('/reset-password/:token', authRateLimiter, async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Password reset token is invalid or has expired' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful! You can now log in with your new password.',
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
