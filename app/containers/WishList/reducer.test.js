import wishListReducer from './reducer';
import { FETCH_WISHLIST, SET_WISHLIST_LOADING } from './constants';

const initialState = { wishlist: [], isLoading: false, wishlistForm: {} };

it('returns the initial state by default', () => {
  expect(wishListReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
});

it('stores the fetched wishlist', () => {
  const wishlist = [{ _id: '1' }];
  expect(wishListReducer(initialState, { type: FETCH_WISHLIST, payload: wishlist }).wishlist).toBe(wishlist);
});

it('sets the loading flag', () => {
  expect(wishListReducer(initialState, { type: SET_WISHLIST_LOADING, payload: true }).isLoading).toBe(true);
});

it('returns the existing state for an unknown action', () => {
  expect(wishListReducer(initialState, { type: 'UNKNOWN' })).toBe(initialState);
});
