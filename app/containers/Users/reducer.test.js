import usersReducer from './reducer';
import {
  FETCH_USERS,
  FETCH_SEARCHED_USERS,
  SET_ADVANCED_FILTERS,
  SET_USERS_LOADING
} from './constants';

const initialState = {
  users: [],
  searchedUsers: [],
  advancedFilters: { totalPages: 1, currentPage: 1, count: 0 },
  isLoading: false
};

it('returns the initial state by default', () => {
  expect(usersReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
});

it('stores the fetched users list', () => {
  const users = [{ _id: '1' }];
  expect(usersReducer(initialState, { type: FETCH_USERS, payload: users }).users).toBe(users);
});

it('stores the searched users list separately from the paginated list', () => {
  const users = [{ _id: '1' }];
  const state = usersReducer(
    { ...initialState, users: [{ _id: '2' }] },
    { type: FETCH_SEARCHED_USERS, payload: users }
  );
  expect(state.searchedUsers).toBe(users);
  expect(state.users).toEqual([{ _id: '2' }]);
});

it('merges advanced filters', () => {
  const state = usersReducer(initialState, { type: SET_ADVANCED_FILTERS, payload: { currentPage: 2 } });
  expect(state.advancedFilters).toEqual({ ...initialState.advancedFilters, currentPage: 2 });
});

it('sets the loading flag', () => {
  expect(usersReducer(initialState, { type: SET_USERS_LOADING, payload: true }).isLoading).toBe(true);
});

it('returns the existing state for an unknown action', () => {
  expect(usersReducer(initialState, { type: 'UNKNOWN' })).toBe(initialState);
});
