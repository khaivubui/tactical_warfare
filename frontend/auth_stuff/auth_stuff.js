import axios from "axios";

export default () => {
  const registerForm = document.querySelector("#register-form");
  const signinForm = document.querySelector("#signin-form");
  const registerButton = document.querySelector('#register-button');
  const signinButton = document.querySelector('#signin-button');

  registerButton.addEventListener('click', () => {
    registerForm.style['max-height'] = '200px';
    signinForm.style['max-height'] = '0px';
  });
  signinButton.addEventListener('click', () => {
    registerForm.style['max-height'] = '0px';
    signinForm.style['max-height'] = '200px';
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
      .then(function(response) {
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
      .then(function(response) {
        console.log(response);
        window.currentUser = response.data;
    });
  });

  // Toggling the auth ui
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
