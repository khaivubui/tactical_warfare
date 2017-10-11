export default socket => {
  socket.on('currentSocket', data => {
    window.currentSocket = data;
    document.querySelector('.current-socket').innerHTML = data.displayName;
  });


  const activeSocketsToggle =
  document.querySelector('.active-sockets-toggle');
  const activeSocketsWidget =
  document.querySelector('.active-sockets-widget');
  activeSocketsWidget.style.right = "-100px";

  activeSocketsToggle.addEventListener('click', () => {
    if (activeSocketsWidget.style.right === "-100px") {
      activeSocketsWidget.style.right = '50%';
      activeSocketsToggle.innerHTML = '>';
    } else {
      activeSocketsWidget.style.right = "-100px";
      activeSocketsToggle.innerHTML = '<';
    }
  });
};
