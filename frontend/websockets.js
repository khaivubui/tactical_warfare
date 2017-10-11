export default socket => {
  socket.on('currentSocket', data => {
    window.currentSocket = data;
  });
};
