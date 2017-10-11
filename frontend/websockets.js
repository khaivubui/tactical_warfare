import io from 'socket.io-client';

export const socket = io();

export const webSockets = () => {
  socket.on('currentSocket', data => {
    document.querySelector('.current-socket').innerHTML = data.displayName;
  });

  const otherActiveSockets =
  document.querySelector('.other-active-sockets');

  socket.on('activeSockets', data => {
    window.activeSockets = data;
    const activeSocketIds = Object.keys(data);

    activeSocketIds.forEach(socketId => {
      const activeSocket = document.createElement('span');
      activeSocket.innerHTML = data[socketId].displayName;
      otherActiveSockets.appendChild(activeSocket);
    });
  });

  socket.on('newActiveSocket', data => {
    const activeSocket = document.createElement('span');
    activeSocket.innerHTML = data.displayName;
    otherActiveSockets.appendChild(activeSocket);
  });

  socket.on('removeActiveSocket', data => {

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
