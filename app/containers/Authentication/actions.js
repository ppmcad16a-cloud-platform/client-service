/*
 *
 * Authentication actions
 *
 */

import { SET_AUTH, CLEAR_AUTH } from './constants';

// The whole app's `authenticated` flag lives here — set on login/signup/
// app-boot-with-a-stored-token (see app.js), cleared on sign-out. Note this
// is a plain boolean, not the token or user object itself; it doesn't
// re-verify the token against the server, it just reflects "do we currently
// have one stored."
export const setAuth = () => {
  return {
    type: SET_AUTH
  };
};

export const clearAuth = () => {
  return {
    type: CLEAR_AUTH
  };
};
