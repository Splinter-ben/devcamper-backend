const authenticationRouter = require('express').Router();
const {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword
} = require('../controllers/authentication.ctrl');
const { protect } = require('../middleware/authentication');

// REGSITER a user
authenticationRouter.route('/auth/register').post(registerUser);

// LOGIN a user
authenticationRouter.route('/auth/login').post(loginUser);

// GET current user info
authenticationRouter.route('/auth/me').get(protect, getMe);

// SEND an token to reset the password
authenticationRouter.route('/auth/forgotpassword').post(forgotPassword);

// SEND an token to reset the password
authenticationRouter.route('/auth/resetpassword/:resettoken').put(resetPassword);

module.exports = authenticationRouter;
