/*
 *
 * Navigation actions
 *
 */

import axios from 'axios';
import handleError from '../../utils/error';
import {
  TOGGLE_MENU,
  TOGGLE_CART,
  TOGGLE_BRAND,
  SEARCH_CHANGE,
  SUGGESTIONS_FETCH_REQUEST,
  SUGGESTIONS_CLEAR_REQUEST
} from './constants';
import { API_URL } from '../../constants';

// Navigation duck: the header's open/closed UI state (mobile category
// menu / cart drawer / brand dropdown — see reducer.js for how they're
// mutually exclusive) plus the header search box's autosuggest state.
export const toggleMenu = () => {
  return {
    type: TOGGLE_MENU
  };
};

export const toggleCart = () => {
  return {
    type: TOGGLE_CART
  };
};

export const toggleBrand = () => {
  return {
    type: TOGGLE_BRAND
  };
};

export const onSearch = v => {
  return {
    type: SEARCH_CHANGE,
    payload: v
  };
};

// Throttles the search-suggestion API calls by character count rather than
// time: only fires when the trimmed input's length is a multiple of 3 (so
// typing "milk" fetches at "mil" but not again until "milke" (5) ->
// "milk t" etc. reaches the next multiple of 3) — an unusual alternative to
// a debounce timer, and it means fetches don't happen on every keystroke.
export const onSuggestionsFetchRequested = value => {
  const inputValue = value.value.trim().toLowerCase();

  return async (dispatch, getState) => {
    try {
      if (inputValue && inputValue.length % 3 === 0) {
        const response = await axios.get(
          `${API_URL}/product/list/search/${inputValue}`
        );
        dispatch({
          type: SUGGESTIONS_FETCH_REQUEST,
          payload: response.data.products
        });
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const onSuggestionsClearRequested = () => {
  return {
    type: SUGGESTIONS_CLEAR_REQUEST,
    payload: []
  };
};
