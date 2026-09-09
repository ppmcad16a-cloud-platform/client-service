/*
 *
 * WishList reducer
 *
 */

import { FETCH_WISHLIST, SET_WISHLIST_LOADING } from './constants';

const initialState = {
  wishlist: [],
  isLoading: false,
  // Unused — no action ever reads or writes wishlistForm.
  wishlistForm: {}
};

const wishListReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_WISHLIST:
      return {
        ...state,
        wishlist: action.payload
      };
    case SET_WISHLIST_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    default:
      return state;
  }
};

export default wishListReducer;
