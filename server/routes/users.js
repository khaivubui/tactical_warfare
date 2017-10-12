// USER ROUTE

const express = require("express");
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

// Register
router.post("/register", (req, res, next) => {
  const newUser = new User({
    username: req.body.username,
    password: req.body.password
  });

  User.addUser(newUser, (err, user) => {
    if (err) {
      res.json({success: false, msg:'Failed to register user'});
    } else {
      const token = jwt.sign({data: user}, config.secret, {
        expiresIn: 604800 // 1 week in seconds
      });

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          username: user.username
        }
      });
    }
  });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if (err) {
      throw err;
    }
    if (!user) {
      return res.json({success: false, msg: 'User not found'});
    }
    // If username exists, then we check the password
    User.comparePassword(password, user.password, (error, isMatch) => {
      if (error) {
        throw error;
      }
      if (isMatch) {
        const token = jwt.sign({data: user}, config.secret, {
          expiresIn: 604800 // 1 week in seconds
        });

        res.json({
          success: true,
          token,
          user: {
            id: user._id,
            username: user.username
          }
        });
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});

module.exports = router;
