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
      const access = 'auth';
      const token = jwt.sign(
        {_id: user._id.toHexString()},
        config.secret
      );

      user.tokens.push({ access, token });

      user.save().then(() => {
        res.json({
          success: true,
          token,
          user: {
            id: user._id,
            username: user.username
          }
        });
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
        const access = 'auth';
        const token = jwt.sign(
          {_id: user._id.toHexString()},
          config.secret
        );

        user.tokens.push({ access, token });

        user.save().then(() => {
          res.json({
            success: true,
            token,
            user: {
              id: user._id,
              username: user.username
            }
          });
        });
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});

module.exports = router;
