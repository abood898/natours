import axios from 'axios';
import { showAlert } from './alerts.js';

export const submitReview = async (review, rating, tour, user) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `https://natours-api-loxk.onrender.com/api/v1/tours/${tour}/reviews`,
      data: {
        tour,
        user,
        review,
        rating,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Review submitted successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
