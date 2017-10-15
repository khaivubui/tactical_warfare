import Cookie from 'js-cookie';

import { closeAuthWidget } from '../auth_stuff/auth_stuff';
import { socket } from '../websockets';

export const signInAs = username => {
  closeAuthWidget();
  const currentUser = document.createElement('div');
  currentUser.classList.add('current-user');
  currentUser.innerHTML = `Hello, ${username}`;

  const authStatus = document.querySelector('.auth-status');
  authStatus.style.width = '90%';
  authStatus.prepend(currentUser);

  const authWidgetToggle = document.querySelector('.auth-widget-toggle');
  authWidgetToggle.innerHTML = 'Sign Out';
  authWidgetToggle.addEventListener('click', signOut);
};

export const signOut = () => {
  const currentUser = document.querySelector('.current-user');
  const authStatus = document.querySelector('.auth-status');
  authStatus.removeChild(currentUser);
  authStatus.style.width = 'auto';

  const authWidgetToggle = document.querySelector('.auth-widget-toggle');
  authWidgetToggle.innerHTML = 'Play now';
  authWidgetToggle.removeEventListener('click', signOut);

  Cookie.set('auth-token', '');
  socket.emit('signOut');
};

window.signOut = signOut;
