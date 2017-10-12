import axios from "axios";

export default () => {
  const registerForm = document.querySelector("#register-form");
  const signinForm = document.querySelector("#signin-form");
  const registerButton = document.querySelector('#register-button');
  const signinButton = document.querySelector('#signin-button');

  // toggling register form
  registerButton.addEventListener('click', () => {
    if (registerButton.style.color === 'rgb(41, 128, 185)') {
      registerForm.style['max-height'] = '0px';
      registerButton.style.color = '#333';
    } else {
      registerForm.style['max-height'] = '200px';
      signinForm.style['max-height'] = '0px';
      registerButton.style.color = '#2980b9';
      signinButton.style.color = '#333';
    }
  });

  // toggling signin form
  signinButton.addEventListener('click', () => {
    if (signinButton.style.color === 'rgb(41, 128, 185)') {
      signinForm.style['max-height'] = '0px';
      signinButton.style.color = '#333';
    } else {
      registerForm.style['max-height'] = '0px';
      signinForm.style['max-height'] = '200px';
      signinButton.style.color = '#2980b9';
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
      .then(response => {
        console.log(response);
        window.currentUser = response.data.username;
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
      .then(response => {
        console.log(response);
        window.currentUser = response.data;
    });
  });

  // Toggling the auth widget
  const authWidget = document.querySelector('.auth-widget');
  const authWidgetToggle = document.querySelector('.auth-widget-toggle');
  authWidget.style.top = '-120px';

  authWidgetToggle.addEventListener(
    'click',
    () => {
      if (authWidget.style.top === '50%') {
        authWidget.style.top = '-120px';
        authWidgetToggle.innerHTML = 'Sign In';
      } else {
        authWidget.style.top = '50%';
        authWidgetToggle.innerHTML = 'Play now';
      }
    }
  );
};
