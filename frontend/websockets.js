import io from 'socket.io-client';

import { closeAuthWidget, hideAuthWidgetToggle } from './auth_stuff/auth_stuff';

export const socket = io();

export let notifyTurn;

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
  activeSockets.style['max-width'] = '0px';

  const openActiveSocketsWidget = () => {
    activeSockets.style['max-width'] = '250px';
    activeSocketsToggle.innerHTML = '>';
  };

  const closeActiveSocketsWidget = () => {
    activeSockets.style['max-width'] = '0px';
    activeSocketsToggle.innerHTML = '<';
  };

  activeSocketsToggle.addEventListener('click', () => {
    if (activeSockets.style['max-width'] === '0px') {
      openActiveSocketsWidget();
    } else {
      closeActiveSocketsWidget();
    }
  });

  // ---------- hide widget toggle ----------

  const hideActiveSocketsWidgetToggle = () => {
    activeSocketsToggle.style['max-width'] = '0px';
  };

  // ---------- Turn Notification ----------

  const notifications = ['YOUR TURN'];
  let notificationIndex = 0;

  notifyTurn = () => {
    const turnNotification = document.querySelector('.turn-notification');
    turnNotification.innerHTML = notifications[notificationIndex];
    turnNotification.style['max-width'] = '300px';
    notificationIndex = (notificationIndex + 1) % notifications.length;
    window.setTimeout(
      () => {
        turnNotification.style['max-width'] = '0';
      },
      1000
    );
  };

  // ---------- startGame ui effects ----------

  const chatWidget = document.querySelector('.chat-widget');
  const chatLog = document.querySelector('.chat-log');

  socket.on('startGame', yourTurn => {
    closeActiveSocketsWidget();
    closeAuthWidget();
    hideActiveSocketsWidgetToggle();
    hideAuthWidgetToggle();
    chatLog.innerHTML = '';
    chatWidget.style['max-height'] = '150px';
    notifications.push('ENEMY TURN');
    notificationIndex = yourTurn ? 0 : 1;
    notifyTurn();
  });

  // ---------- Chat handler ----------

  socket.on('chatMessage', data => {
    const chatMessage = document.createElement('span');
    const sender = document.createElement('strong');
    const message = document.createElement('span');

    sender.innerHTML = `${data.sender}: `;
    message.innerHTML = data.message;

    chatMessage.classList.add('chat-message');
    chatMessage.appendChild(sender);
    chatMessage.appendChild(message);

    chatLog.appendChild(chatMessage);
    chatLog.scrollTop = chatLog.scrollHeight;
  });

};
