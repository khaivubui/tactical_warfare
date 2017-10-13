const faker = require('faker');

module.exports = io => {
  const activeSockets = {}; // used to store all active sockets


  io.on('connection', socket => {
    io.to(socket.id).emit('activeSockets', activeSockets);

    // add newly connected socket to the store with a random name
    activeSockets[socket.id] = {
      id: socket.id,
      opponentSocketId: null,
      displayName:
      `${faker.name.firstName()} the ${faker.commerce.productName()}`
    };

    // emit to the newly connected socket its information
    io.to(socket.id).emit('currentSocket', activeSockets[socket.id]);

    // emit to all other sockets that there is a new online socket
    socket.broadcast.emit('newActiveSocket', activeSockets[socket.id]);

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

      [player1Id, player2Id].forEach(playerId => {
        console.log('sdfdasfdas');
        io.to(playerId).emit(
          'startGame'
        );
      });
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

    //--------------------------------------------- the game
    const sendToOpponent = message =>(
      socket.on(message, data => {
        io.to(activeSockets[socket.id].opponentSocketId).emit(message, data);
      })
    );
    const gameplayMessages = ["position", "moveType", "attack", "cancel"];
    for(let i = 0; i< gameplayMessages.length; ++i){
      sendToOpponent(gameplayMessages[i]);
    }
  });
};
