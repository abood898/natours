import axios from 'axios';
import { showAlert } from './alerts.js';

export const searchTour = async (name) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `https://natours-api-loxk.onrender.com/api/v1/tours/name/${name}`,
      data: {},
    });
    if (res.data.status === 'success') {
      location.assign(`/tour/${res.data.data.document.slug}`);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
