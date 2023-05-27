import axios from 'axios';
import { showAlert } from './alerts.js';

function isEmail(emailAddress) {
  let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (emailAddress.match(regex)) return true;
  else return false;
}
function passMatch(password, passwordConfirm) {
  return password === passwordConfirm;
}

export const signup = async (data) => {
  try {
    if (!data.name || !data.email || !data.password || !data.passwordConfirm)
      throw new Error('Please fill all the information');
    if (!isEmail(data.email)) throw new Error('Write a valid email!');
    if (!passMatch(data.password, data.passwordConfirm))
      throw new Error('Password and Confirm Password must match!');

    const res = await axios({
      method: 'POST',
      url: 'https://natours-api-loxk.onrender.com/api/v1/users/signup',
      data,
    });
    location.assign('/emailConfirm');
  } catch (error) {
    showAlert('error', error);
  }
};
