import io from 'socket.io-client';

import { closeAuthWidget } from './auth_stuff/auth_stuff';

export const socket = io();

export const webSockets = () => {
  const otherActiveSockets =
  document.querySelector('.other-active-sockets');

  // helper for appending online user to list
  otherActiveSockets.appendActiveSocket = data => {
    const activeSocket = document.createElement('span');
    activeSocket.innerHTML = data.displayName;
    activeSocket.id = data.id;

    const challengeButton = document.createElement('button');
    challengeButton.classList.add('challenge-button');
    challengeButton.id = data.id;
    challengeButton.innerHTML = 'challenge';

    // handler for clicking 'challenge'
    challengeButton.addEventListener('click', e => {
      socket.emit('challengeSent', data.id);
      challengeButton.innerHTML = 'challenge sent';
      challengeButton.disabled = true;
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

  socket.on('challengeReceived', challenger => {
    document.querySelector('.challenge-message').innerHTML =
    `${challenger.displayName} has challenged you to a tank duel`;

    const yesButton = document.createElement('button');
    yesButton.innerHTML = "Let's do it!";

    const noButton = document.createElement('button');
    noButton.innerHTML = 'Nah!';

    const challengeResponseOptions =
    document.querySelector('.challenge-response-options');

    challengeResponseOptions.appendChild(yesButton);
    challengeResponseOptions.appendChild(noButton);

    const challengeReceivedWidget =
    document.querySelector('.challenge-received');

    const closeWidget = () => {
      challengeReceivedWidget.style['max-height'] = '0px';
      challengeResponseOptions.removeChild(yesButton);
      challengeResponseOptions.removeChild(noButton);
    };

    yesButton.addEventListener('click', () => {
      closeWidget();
      socket.emit('challengeAccepted', socket.id, challenger.id);
    });

    noButton.addEventListener('click', () => {
      closeWidget();
      socket.emit('challengeDenied', socket.id, challenger.id);
    });

    challengeReceivedWidget.style['max-height'] = '200px';
  });

  // ---------- denial handler ----------

  socket.on('challengeDenied', denierId => {
    const challengeButton =
    document.querySelector(`button#${denierId}`);

    challengeButton.innerHTML = 'challenge';
    challengeButton.disabled = false;
  });

  // ---------- toggling the widget ----------
  const activeSocketsToggle =
  document.querySelector('.active-sockets-toggle');
  const activeSockets = document.querySelector('.active-sockets');
  const activeSocketsWidget =
  document.querySelector('.active-sockets-widget');
  activeSocketsWidget.style.right = "16px";

  const openActiveSocketsWidget = () => {
    activeSockets.style['max-width'] = '250px';
    activeSocketsWidget.style.right = '50%';
    activeSocketsToggle.innerHTML = '>';
  };

  const closeActiveSocketsWidget = () => {
    activeSockets.style['max-width'] = '0px';
    activeSocketsWidget.style.right = "16px";
    activeSocketsToggle.innerHTML = '<';
  };

  activeSocketsToggle.addEventListener('click', () => {
    if (activeSocketsWidget.style.right === "16px") {
      openActiveSocketsWidget();
    } else {
      closeActiveSocketsWidget();
    }
  });

  // ---------- startGame toggling widget ----------

  socket.on('startGame', () => {
    closeActiveSocketsWidget();
    closeAuthWidget();
  });
};
