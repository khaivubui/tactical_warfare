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

    axios.post('/users/register', { username, password });
  });


  signinForm.addEventListener('submit', e => {
    e.preventDefault();
    const username = document.querySelector(
      '#signin-form input[type=text]'
    ).value;
    const password = document.querySelector(
      '#signin-form input[type=password]'
    ).value;
  });
};
