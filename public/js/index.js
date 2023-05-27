import {
  updateSettings,
  sendResetToken,
  resetPassword,
} from './updateSettings.js';
import { displayMap } from './mapbox.js';
import { login, logout } from './login.js';
import { signup } from './signup.js';
import { bookTour } from './stripe.js';
import { searchTour } from './search.js';
import { submitReview } from './reviews.js';

// DOM ELEMENTS
const resetPassBtn = document.getElementById('send_reset_token_btn');
const resetPasswordButton = document.getElementById('resetPasswordButton');

const reviewAddForm = document.getElementById('add_review');

// MAP BOX
if ($('#map').length) displayMap($('#map').data('locations'));

// LOGIN FORM
$('.login-form#login button').click(function (e) {
  e.preventDefault();
  login($('#email').val(), $('#password').val());
});
$('.login-form#login #email, .login-form#login #password').keypress(function (
  e
) {
  if (e.key === 'Enter') login($('#email').val(), $('#password').val());
});

// SIGNUP FORM
$('.login-form#signup button').click(function (e) {
  e.preventDefault();
  signup({
    name: $('#name').val(),
    email: $('#email').val(),
    password: $('#password').val(),
    passwordConfirm: $('#passwordConfirm').val(),
  });
});
$(
  '.login-form#signup #email, .login-form#signup #password, .login-form#signup #name, .login-form#signup #passwordConfirm'
).keypress(function (e) {
  if (e.key === 'Enter')
    signup({
      name: $('#name').val(),
      email: $('#email').val(),
      password: $('#password').val(),
      passwordConfirm: $('#passwordConfirm').val(),
    });
});

// USER DATA FORM
$('.form-user-data button').click(function (e) {
  e.preventDefault();
  const form = new FormData();
  form.append('name', $('#name').val());
  form.append('email', $('#email').val());
  form.append('photo', $('#photo')[0].files[0]);
  updateSettings(form, 'data');
});

// USER SETTINGS FORM
$('.form-user-settings button').click(async function (e) {
  e.preventDefault();
  $(this).text('Updating...');

  await updateSettings(
    {
      passwordCurrent: $('#password-current').val(),
      password: $('#password').val(),
      passwordConfirm: $('#password-confirm').val(),
    },
    'password'
  );
  $(this).text('Save password');
  $('#password-current').val('');
  $('#password').val('');
  $('#password-confirm').val('');
});
$(
  '.form-user-settings #password-current, .form-user-settings #password, .form-user-settings #password-confirm'
).keypress(async function (e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    $(this).text('Updating...');
    await updateSettings(
      {
        passwordCurrent: $('#password-current').val(),
        password: $('#password').val(),
        passwordConfirm: $('#password-confirm').val(),
      },
      'password'
    );
    $(this).text('Save password');
    $('#password-current').val('');
    $('#password').val('');
    $('#password-confirm').val('');
  }
});

// LOG OUT BUTTON
$('.nav__el.nav__el--logout').click(logout);

$('button.btn.btn--green.span-all-rows#book-tour-btn').click(function (e) {
  $(this).text('Processing...');
  const tourID = $(this).data('tourId');
  bookTour(tourID, $(this));
});

if (resetPassBtn) {
  const email = document.getElementById('email');
  resetPassBtn.addEventListener('click', async (e) => {
    resetPassBtn.textContent = 'Processing...';
    await sendResetToken(email.value);
    resetPassBtn.textContent = 'send reset token';
  });
  email.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
      resetPassBtn.textContent = 'Processing...';
      await sendResetToken(email.value);
      resetPassBtn.textContent = 'send reset token';
    }
  });
}

if (resetPasswordButton) {
  const password = document.getElementById('password');
  const passwordConfirm = document.getElementById('passwordConfirm');
  resetPasswordButton.addEventListener('click', async (e) => {
    resetPasswordButton.textContent = 'Processing...';
    await resetPassword(
      password.value,
      passwordConfirm.value,
      window.location.pathname.split('/')[2]
    );
    resetPasswordButton.textContent = 'Reset Password';
    password.value = '';
    passwordConfirm.value = '';
  });
  [password, passwordConfirm].forEach((elem) => {
    elem.addEventListener('keypress', async (e) => {
      if (e.key === 'Enter') {
        resetPasswordButton.textContent = 'Processing...';
        await resetPassword(
          password.value,
          passwordConfirm.value,
          window.location.pathname.split('/')[2]
        );
        resetPasswordButton.textContent = 'Reset Password';
        password.value = '';
        passwordConfirm.value = '';
      }
    });
  });
}

$('#search').autocomplete({
  source: ['THE PARK CAMPER', 'THE SEA EXPLOERER'],
});
$('form.nav__search').on('submit', function (e) {
  e.preventDefault();
  searchTour($('#search').val());
});

if (reviewAddForm) {
  const reviewStars = document.getElementsByClassName('reviews__star');
  const submitReviewButton = document.getElementById('submitReview');
  const tourID = submitReviewButton.dataset.tourId;
  const userID = submitReviewButton.dataset.userId;
  const reviewTextArea = document.getElementById('review');
  for (const reviewStar of reviewStars) {
    reviewStar.addEventListener('click', (e) => {
      for (let index = 1; index <= 5; index++) {
        const element = reviewStars[index - 1];
        if (index <= reviewStar.id) {
          element.classList.remove('reviews__star--inactive');
          element.classList.add('reviews__star--active');
        } else {
          element.classList.remove('reviews__star--active');
          element.classList.add('reviews__star--inactive');
        }
      }
    });
  }
  reviewAddForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const review = reviewTextArea.value;
    const rating = document.getElementsByClassName(
      'reviews__star--active'
    ).length;
    submitReviewButton.innerText = 'Processing...';

    submitReview(review, rating, tourID, userID);

    submitReviewButton.innerText = 'Submit Review';
    reviewTextArea.value = '';
    for (let index = 1; index <= 5; index++) {
      const element = reviewStars[index - 1];
      if (element.classList.contains('reviews__star--active')) {
        element.classList.remove('reviews__star--active');
        element.classList.add('reviews__star--inactive');
      }
    }
  });
}
