/**
 *
 * token.js
 * axios default headers setup
 *
 * Sets (or clears) the Authorization header on axios's shared defaults, so
 * every subsequent axios call anywhere in the app automatically sends the
 * token — call sites never attach it per-request themselves.
 */

import axios from 'axios';

const setToken = token => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = token;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export default setToken;
