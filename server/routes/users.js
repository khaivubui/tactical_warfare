// USER ROUTE

const express = require("express");
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const bcrypt = require('bcryptjs');
const expressValidator = require('express-validator');

router.use(expressValidator());
// Register
router.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();

  let errors = req.validationErrors();

  if (errors) {
    console.log(errors);
  } else {
    let newUser = new User({
      username: username,
      password: password
    });
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) {
          console.log(err);
        }
        newUser.password = hash;
        newUser.save(function(err){
          if (err) {
            console.log(err);
            return;
          } else {
            // req.flash('success', 'You are now registered and can log in');
            res.redirect('/users/profile');
          }
        });
      });
    });
  }


  });

// router.post("/register", (req, res, next) => {
//   let newUser = new User({
//     username: req.body.username,
//     password: req.body.password
//   });
//
//   User.addUser(newUser, (err, user) => {
//     console.log(newUser);
//     if (err) {
//       res.json({success: false, msg:'Failed to register user'});
//     } else {
//       res.json({success: true, msg:'User registered'});
//     }
//   });
// });

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
          token: 'JWT '+token,
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

// Profile (protected route because of passport.authenticate('jwt', {session:false}))
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});
});


module.exports = router;
