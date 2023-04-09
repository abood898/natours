// import '@babel/polyfill';

import { updateSettings } from './updateSettings.js';
import { displayMap } from './mapbox.js';
import { login, logout } from './login.js';
import { bookTour } from './stripe.js';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.login-form .form__group button');
const logOutBtn = document.querySelector('.nav__el.nav__el--logout');
const saveDataSettingsForm = document.querySelector(
  '.form.form-user-data .form__group.right button'
);
const savePasswordSettingsForm = document.querySelector(
  '.form.form-user-settings .form__group.right button'
);
const bookTourBtn = document.querySelector(
  'button.btn.btn--green.span-all-rows#book-tour-btn'
);

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}
if (loginForm) {
  loginForm.addEventListener('click', (e) => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}
if (saveDataSettingsForm) {
  saveDataSettingsForm.addEventListener('click', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateSettings(form, 'data');
  });
}
if (savePasswordSettingsForm) {
  savePasswordSettingsForm.addEventListener('click', async (e) => {
    e.preventDefault();
    savePasswordSettingsForm.textContent = 'Updating...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );
    savePasswordSettingsForm.textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}

if (bookTourBtn) {
  bookTourBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const tourID = e.target.dataset.tourId;
    bookTour(tourID, e.target);
  });
}
