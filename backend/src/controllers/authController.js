const AppError = require("../utils/AppError");
const generateToken = require("../utils/generateToken");
const HTTP = require("../constants/httpStatus");
const ERRORS = require("../constants/errorCodes");
const MESSAGES = require("../constants/messages");
const User = require("../models/User");

// POST /api/v1/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Explicitly select password for comparison (excluded by default)
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      throw new AppError(
        MESSAGES.INVALID_CREDENTIALS,
        HTTP.UNAUTHORIZED,
        ERRORS.AUTH_INVALID_CREDENTIALS
      );
    }

    const token = generateToken(user);

    res.status(HTTP.OK).json({
      success: true,
      message: MESSAGES.LOGIN_SUCCESS,
      data: {
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/auth/logout
const logout = async (req, res, next) => {
  try {
    // Update lastLogout timestamp to invalidate existing tokens
    const now = new Date();
    await User.findByIdAndUpdate(req.user._id, { lastLogout: now });

    res.status(HTTP.OK).json({
      success: true,
      message: MESSAGES.LOGOUT_SUCCESS,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("name email role avatar");

    res.status(HTTP.OK).json({
      success: true,
      message: MESSAGES.USER_FETCHED,
      data: { user },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/auth/users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("name email role avatar");
    // Map _id to id perfectly for frontend interface
    const formattedUsers = users.map(u => ({
      id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      avatar: u.avatar
    }));
    res.status(HTTP.OK).json({ success: true, data: { users: formattedUsers } });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, logout, getMe, getUsers };
