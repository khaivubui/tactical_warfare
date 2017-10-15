import axios from "axios";
import Cookie from 'js-cookie';

import { signInAs } from '../ui/auth_ui';
import { socket } from '../websockets';

export let openAuthWidget;
export let closeAuthWidget;
export let hideAuthWidgetToggle;
export let unhideAuthWidgetToggle;

export default () => {
  const registerForm = document.querySelector("#register-form");
  const signinForm = document.querySelector("#signin-form");
  const registerButton = document.querySelector('#register-button');
  const signinButton = document.querySelector('#signin-button');

  registerButton.addEventListener('click', () => {
    if (registerButton.style.color === 'rgb(39, 174, 96)') {
      registerForm.style['max-height'] = '0px';
      registerButton.style.color = '#333';
    } else {
      registerForm.style['max-height'] = '200px';
      signinForm.style['max-height'] = '0px';
      registerButton.style.color = '#27ae60';
      signinButton.style.color = '#333';
    }
  });
  signinButton.addEventListener('click', () => {
    if (signinButton.style.color === 'rgb(39, 174, 96)') {
      signinForm.style['max-height'] = '0px';
      signinButton.style.color = '#333';
    } else {
      registerForm.style['max-height'] = '0px';
      signinForm.style['max-height'] = '200px';
      signinButton.style.color = '#27ae60';
      registerButton.style.color = '#333';
    }
  });

  registerForm.addEventListener('submit', e => {
    e.preventDefault();
    const username = document.querySelector(
      '#register-form input[type=text]'
    ).value;
    const password = document.querySelector(
      '#register-form input[type=password]'
    ).value;

    axios.post('/users/register', { username, password })
      .then(({ data }) => {
        if (data.success) {
          Cookie.set('auth-token', data.token);
          signInAs(data.user.username); // only UI
          socket.emit('signIn', data.token);
        } else {
          alert(data.msg);
        }
      });
  });


  signinForm.addEventListener('submit', e => {
    e.preventDefault();
    const username = document.querySelector(
      '#signin-form input[type=text]'
    ).value;
    const password = document.querySelector(
      '#signin-form input[type=password]'
    ).value;

    axios.post('/users/authenticate', { username, password })
      .then(({ data }) => {
        if (data.success) {
          Cookie.set('auth-token', data.token);
          signInAs(data.user.username); // only UI
          socket.emit('signIn', data.token);
        } else {
          alert(data.msg);
        }
      });
  });

  // Toggling the auth ui
  const authWidget = document.querySelector('.auth-widget');
  const authMain = document.querySelector('.auth-main');
  const authWidgetToggle = document.querySelector('.auth-widget-toggle');

  openAuthWidget = () => {
    authWidget.style.top = '50%';
    authMain.style['max-height'] = '277px';
    authWidget.style['border-radius'] = '20px';
    authWidgetToggle.innerHTML = 'Play now';
  };

  closeAuthWidget = () => {
    authWidget.style.top = '15px';
    authMain.style['max-height'] = '0px';
    authWidget.style['border-radius'] = '0 0 20px 20px';
    authWidgetToggle.innerHTML = 'Sign In';
  };

  authWidgetToggle.addEventListener(
    'click',
    () => {
      if (authWidget.style.top === '50%') {
        closeAuthWidget();
      } else {
        openAuthWidget();
      }
    }
  );

  const authStatus = document.querySelector('.auth-status');

  hideAuthWidgetToggle = () => {
    authStatus.style['max-height'] = '0px';
  };

  unhideAuthWidgetToggle = () => {
    authStatus.style['max-height'] = '30px';
  };
};
