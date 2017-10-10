module.exports = io => {
  const activeSockets = [];

  io.on('connection', socket => {
    console.log(`${socket.id} has connected`);
    activeSockets.push(socket.id);


    socket.on('disconnect', reason => {
      console.log(`${socket.id} disconnected because ${reason}`);
      // remove
    });
  });
};
