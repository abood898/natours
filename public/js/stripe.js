// import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { showAlert } from './alerts.js';
const stripe = Stripe(
  'pk_test_51Mu3k3CzTQJa13g2lOC9KpCNOP1QFTTovaskqN0RjwiBeV2iFvg6c0DCJoMpWiCClBaY8HLy9hjSVLqEA1Sgnxct00PJTRWk6Q'
);

export const bookTour = async (tourID, elem) => {
  try {
    const res = await axios(`/api/v1/bookings//checkout-session/${tourID}`);

    await stripe.redirectToCheckout({
      sessionId: res.data.session.id,
    });
    elem.textContent = 'Book tour now!';
  } catch (error) {
    showAlert('error', error.message);
  }
};
