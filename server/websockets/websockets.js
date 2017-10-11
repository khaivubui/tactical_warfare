const faker = require('faker');

module.exports = io => {
  const activeSockets = {};

  io.on('connection', socket => {
    io.to(socket.id).emit('activeSockets', activeSockets);

    // Automatically assign a random name to the socket
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

    //
    socket.on('challengeSent', opponentSocketId => {
      console.log(`${socket.id} is challenging ${opponentSocketId}`);
      io.to(opponentSocketId).emit('challengeReceived', socket.id);
    });

    // remove itself from all other socket lists
    socket.on('disconnect', reason => {
      socket.broadcast.emit('removeActiveSocket', activeSockets[socket.id]);
      delete activeSockets[socket.id];
    });
  });
};
