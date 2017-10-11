const faker = require('faker');

module.exports = io => {
  const activeSockets = {};

  io.on('connection', socket => {
    // Automatically assign a random name to the socket
    activeSockets[socket.id] = {
      opponentSocketId: null,
      displayName:
      `${faker.name.firstName()} the ${faker.commerce.productName()}`
    };

    // emit to the newly connected socket its information
    io.to(socket.id).emit('currentSocket', activeSockets[socket.id]);

    // emit to all other sockets that there is a new online socket
    socket.broadcast.emit('newActiveSocket', activeSockets[socket.id]);

    socket.on('disconnect', reason => {
      delete activeSockets[socket.id];
    });
  });
};
