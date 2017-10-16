# [Tactical Warfare](https://tactical-warfare.herokuapp.com/)

![preview](https://github.com/khaivubui/tactical_warfare/blob/final-readme-and-styling/docs/preview.png)

[live version](https://tactical-warfare.herokuapp.com/)

## Overview

Tactical Warfare is a 2 player 3D online Tank game. Implemented almost entirely using JavaScript, the game allows a user to register, sign in, sign out, challenge other players, accept challenges from other players, move their tank, fire projectiles, compete and communicate in real time.

## Technology Overview

- Node.js
- Express.js
- MongoDB / Mongoose
- Socket.io
- Cannon.js
- Babylon.js

## User Auth

- User can register for an account
- User can sign in
- User stays signed in
- Other players see the user if the user is online

![user-auth](https://github.com/khaivubui/tactical_warfare/blob/master/docs/auth_demo.gif)

#### Password encryption with BCrypt

```javascript
User.addUser = function(newUser, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (errors, hash) => {
      // ...
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

User.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    // ...
    callback(null, isMatch);
  });
};
```

#### JSONWebToken

A token is sent to the front end on successful sign in or registration:

```javascript
const token = jwt.sign({_id: user._id.toString()}, config.secret);

res.json({
  success: true,
  token,
  user: {
    username: user.username
  }
});
```

The front end then stores this token in its cookie
```javascript
Cookie.set('auth-token', data.token);
```

On new connection, the server checks if the client has an auth-token in their cookie already, and automatically assign a username to the socket:
```javascript
User.findByToken(token).then(user => {
  if (user) {
    currentSocket.displayName = user.username;
    io.to(socket.id).emit('signIn', currentSocket);
  }
  // emit to itself
  io.to(socket.id).emit('currentSocket', currentSocket);
  // emit to other sockets
  socket.broadcast.emit('newActiveSocket', currentSocket);
});
```

## Dynamic Camera

![camera-general](https://github.com/khaivubui/tactical_warfare/blob/master/docs/camera_general_demo.gif)
![camera-aim](https://github.com/khaivubui/tactical_warfare/blob/master/docs/camera_aim_demo.gif)

## 2-Player Online Mode

![challenge-sent](https://github.com/khaivubui/tactical_warfare/blob/master/docs/challenge_sent_demo.gif)
![challenge-received](https://github.com/khaivubui/tactical_warfare/blob/master/docs/challenge_received_demo.gif)

## Realistic Game Mechanics

![health-loss](https://github.com/khaivubui/tactical_warfare/blob/master/docs/health_loss_demo.gif)
![timer](https://github.com/khaivubui/tactical_warfare/blob/master/docs/timer_demo.gif)

## Live Chat

Using Socket.io, chat messages are relayed to the opponent in real time

![live-chat](https://github.com/khaivubui/tactical_warfare/blob/master/docs/live_chat_demo.gif)
