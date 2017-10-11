import io from 'socket.io-client';

export const socket = io();

export const webSockets = () => {
  const otherActiveSockets =
  document.querySelector('.other-active-sockets');

  otherActiveSockets.appendActiveSocket = data => {
    const activeSocket = document.createElement('span');
    activeSocket.innerHTML = data.displayName;
    activeSocket.id = data.id;

    const challengeButton = document.createElement('button');
    challengeButton.classList.add('challenge-button');
    challengeButton.innerHTML = 'challenge';
    challengeButton.addEventListener('click', e => {
      socket.emit('challengeSent', data.id);
    });

    activeSocket.appendChild(challengeButton);
    otherActiveSockets.appendChild(activeSocket);
  };

  // socket event handlers for updating the list of online users
  socket.on('currentSocket', data => {
    document.querySelector('.current-socket').innerHTML = data.displayName;
  });

  socket.on('activeSockets', data => {
    window.activeSockets = data;
    const activeSocketIds = Object.keys(data);

    activeSocketIds.forEach(socketId => {
      otherActiveSockets.appendActiveSocket(data[socketId]);
    });
  });

  socket.on('newActiveSocket', data => {
    otherActiveSockets.appendActiveSocket(data);
  });

  socket.on('removeActiveSocket', data => {
    const activeSocket = document.getElementById(data.id);
    otherActiveSockets.removeChild(activeSocket);
  });

  // ---------- challengeReceived ----------

  socket.on('challengeReceived', challengerId => {
    console.log(document.getElementById(challengerId));
  });

  // ---------- toggling the widget ----------
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
