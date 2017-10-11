const faker = require('faker');

module.exports = io => {
  const activeSockets = {};

  io.on('connection', socket => {
    // console.log(`${socket.id} has connected`);
    activeSockets[socket.id] = {
      opponentSocketId: null,
      displayName:
      `${faker.name.firstName()} the ${faker.commerce.productName()}`
    };
    console.log(
      `${activeSockets[socket.id].displayName} has connected`
    );

    socket.on('disconnect', reason => {
      console.log(`${socket.id} disconnected because ${reason}`);
      delete activeSockets[socket.id];
    });
  });
};
