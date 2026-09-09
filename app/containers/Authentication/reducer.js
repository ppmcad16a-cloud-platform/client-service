/*
 *
 * Authentication reducer
 * Holds just the boolean `authenticated` flag (plus an unused `isLoading`)
 * — mounted at state.authentication.
 *
 */

import { SET_AUTH, CLEAR_AUTH } from './constants';

const initialState = {
  authenticated: false,
  isLoading: false
};

const authenticationReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_AUTH:
      return {
        ...state,
        authenticated: true
      };
    case CLEAR_AUTH:
      return {
        ...state,
        authenticated: false
      };
    default:
      return state;
  }
};

export default authenticationReducer;
