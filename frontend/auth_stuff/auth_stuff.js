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
};
