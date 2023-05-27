import axios from 'axios';
import { showAlert } from './alerts.js';

export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'https://natours-api-loxk.onrender.com/api/v1/users/updateMyPassword'
        : 'https://natours-api-loxk.onrender.com/api/v1/users/updateMe';
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success')
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
export const sendResetToken = async (email) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'https://natours-api-loxk.onrender.com/api/v1/users/forgotPassword',
      data: {
        email,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Token Sent Successfully!');
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
export const resetPassword = async (password, passwordConfirm, token) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `https://natours-api-loxk.onrender.com/api/v1/users/resetPassword/${token}`,
      data: {
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Password Reset Successfully!');
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
