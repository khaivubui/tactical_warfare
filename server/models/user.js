// USER MODEL

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
const jwt = require('jsonwebtoken');

// User Schema
const UserSchema = mongoose.Schema({
  username: { type: 'String', required: true },
  password: { type: 'String', required: true },
  socketId: { type: 'String' }
});



const User = module.exports = mongoose.model('User', UserSchema);

User.getUserById = function(id, callback){
  User.findById(id, callback);
};

User.getUserByUsername = function(username, callback){
  User.findOne({username}, callback);
};

User.addUser = function(newUser, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (errors, hash) => {
      if (errors) {
        throw errors;
      }
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

User.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) {
      throw err;
    }
    callback(null, isMatch);
  });
};

User.findByToken = token => {
  const data = jwt.verify(token, config.secret);
  // const _id = mongoose.Types.ObjectId(data._id);
  const {_id} = data;
  return User.findById(_id);
};
