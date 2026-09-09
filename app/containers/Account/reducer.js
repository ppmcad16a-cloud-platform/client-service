/*
 *
 * Account reducer
 *
 */

import {
  ACCOUNT_CHANGE,
  FETCH_PROFILE,
  CLEAR_ACCOUNT,
  SET_PROFILE_LOADING
} from './constants';

const initialState = {
  user: {
    firstName: '',
    lastName: '',
    provider: '',
    role: ''
  },
  isLoading: false
};

// NOTE: CLEAR_ACCOUNT below resets `user` to only
// { firstName: '', lastName: '' } — provider/role aren't reset back to
// their initialState defaults, so `user.role` becomes undefined (not '')
// immediately after sign-out, rather than matching the shape above.

const accountReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACCOUNT_CHANGE:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      };
    case FETCH_PROFILE:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      };
    case CLEAR_ACCOUNT:
      return {
        ...state,
        user: {
          firstName: '',
          lastName: ''
        }
      };
    case SET_PROFILE_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    default:
      return state;
  }
};

export default accountReducer;
