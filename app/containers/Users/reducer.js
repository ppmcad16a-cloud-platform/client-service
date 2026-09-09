/*
 *
 * Users reducer
 *
 */

import {
  FETCH_USERS,
  FETCH_SEARCHED_USERS,
  SET_ADVANCED_FILTERS,
  SET_USERS_LOADING
} from './constants';

const initialState = {
  // Current page of the full user list (fetchUsers).
  users: [],
  // Search results (searchUsers) — a separate slice so switching in/out of
  // search doesn't clobber the paginated `users` list underneath it.
  searchedUsers: [],
  advancedFilters: {
    totalPages: 1,
    currentPage: 1,
    count: 0
  },
  isLoading: false
};

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS:
      return {
        ...state,
        users: action.payload
      };
    case FETCH_SEARCHED_USERS:
      return {
        ...state,
        searchedUsers: action.payload
      };
    case SET_ADVANCED_FILTERS:
      return {
        ...state,
        advancedFilters: {
          ...state.advancedFilters,
          ...action.payload
        }
      };
    case SET_USERS_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    default:
      return state;
  }
};

export default usersReducer;
