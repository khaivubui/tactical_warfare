import { closeAuthWidget } from '../auth_stuff/auth_stuff';

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

  const currentSocket = document.querySelector('.current-socket');
  currentSocket.innerHTML = username;
};
