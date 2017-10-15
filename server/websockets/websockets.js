const faker = require('faker');

const User = require('../models/user');

module.exports = io => {
  const activeSockets = {}; // used to store all active sockets

  io.on('connection', socket => {
    io.to(socket.id).emit('activeSockets', activeSockets);

    // add newly connected socket to the store with a random name
    activeSockets[socket.id] = {
      id: socket.id,
      opponentSocketId: null,
      displayName:
      // `${faker.name.firstName()} the ${faker.commerce.productName()}`
      faker.commerce.productName()
    };

    let token = socket.request.headers.cookie['auth-token'];
    User.findByToken(token).then(user => {
      if (user) {
        activeSockets[socket.id].displayName = user.username;
      }
      // emit to itself
      io.to(socket.id).emit('currentSocket', activeSockets[socket.id]);
      // emit to other sockets
      socket.broadcast.emit('newActiveSocket', activeSockets[socket.id]);
    });

    // routing the challenge to the opponent
    socket.on('challengeSent', opponentSocketId => {
      io.to(opponentSocketId).emit(
        'challengeReceived',
        activeSockets[socket.id]
      );
    });

    // handling challenge accepted and start game
    socket.on('challengeAccepted', (player1Id, player2Id) => {
      activeSockets[player1Id].opponentSocketId = player2Id;
      activeSockets[player2Id].opponentSocketId = player1Id;
      io.to(player1Id).emit('startGame', true); // true === your turn
      io.to(player2Id).emit('startGame', false); // false === not your turn
    });

    // handling challenge refused
    socket.on('challengeDenied', (denierId, challengerId) => {
      io.to(challengerId).emit('challengeDenied', denierId);
    });

    // remove itself from all other socket lists
    socket.on('disconnect', reason => {
      socket.broadcast.emit('removeActiveSocket', activeSockets[socket.id]);
      delete activeSockets[socket.id];
    });

    // chat relay
    socket.on('chatMessage', message => {
      io.to(activeSockets[socket.id].opponentSocketId).emit(
        'chatMessage',
        {
          sender: activeSockets[socket.id].displayName,
          message
        }
      );
      io.to(socket.id).emit(
        'chatMessage',
        {
          sender: activeSockets[socket.id].displayName,
          message
        }
      );
    });

    //auth
    socket.on('signIn', () => {
      token = socket.request.headers.cookie['auth-token'];
      User.findByToken(token).then(user => {
        activeSockets[socket.id].displayName = user.username;
        socket.broadcast.emit('updateActiveSocket', activeSockets[socket.id]);
      });
    });

    //--------------------------------------------- the game
    const sendToOpponent = message =>(
      socket.on(message, data => {
        io.to(activeSockets[socket.id].opponentSocketId).emit(message, data);
      })
    );
    const gameplayMessages = ["position", "moveType", "attack", "cancel", "switchPlayer"];
    for(let i = 0; i< gameplayMessages.length; ++i){
      sendToOpponent(gameplayMessages[i]);
    }
  });
};
