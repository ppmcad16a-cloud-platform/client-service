import navigationReducer from './reducer';
import {
  TOGGLE_MENU,
  TOGGLE_CART,
  TOGGLE_BRAND,
  SEARCH_CHANGE,
  SUGGESTIONS_FETCH_REQUEST,
  SUGGESTIONS_CLEAR_REQUEST
} from './constants';

const initialState = {
  isMenuOpen: false,
  isCartOpen: false,
  isBrandOpen: false,
  searchValue: '',
  searchSuggestions: []
};

it('returns the initial state by default', () => {
  expect(navigationReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
});

it('opens the menu and force-closes the cart', () => {
  const state = navigationReducer(
    { ...initialState, isCartOpen: true },
    { type: TOGGLE_MENU }
  );
  expect(state.isMenuOpen).toBe(true);
  expect(state.isCartOpen).toBe(false);
});

it('opens the cart and force-closes the menu', () => {
  const state = navigationReducer(
    { ...initialState, isMenuOpen: true },
    { type: TOGGLE_CART }
  );
  expect(state.isCartOpen).toBe(true);
  expect(state.isMenuOpen).toBe(false);
});

it('toggles the brand dropdown independently', () => {
  const state = navigationReducer(
    { ...initialState, isMenuOpen: true, isCartOpen: true },
    { type: TOGGLE_BRAND }
  );
  expect(state.isBrandOpen).toBe(true);
  expect(state.isMenuOpen).toBe(true);
  expect(state.isCartOpen).toBe(true);
});

it('sets the search value', () => {
  expect(navigationReducer(initialState, { type: SEARCH_CHANGE, payload: 'shoes' }).searchValue).toBe('shoes');
});

it('sets search suggestions on fetch', () => {
  const suggestions = [{ name: 'Shoe' }];
  expect(
    navigationReducer(initialState, { type: SUGGESTIONS_FETCH_REQUEST, payload: suggestions }).searchSuggestions
  ).toBe(suggestions);
});

it('clears search suggestions', () => {
  const state = navigationReducer(
    { ...initialState, searchSuggestions: [{ name: 'Shoe' }] },
    { type: SUGGESTIONS_CLEAR_REQUEST, payload: [] }
  );
  expect(state.searchSuggestions).toEqual([]);
});

it('returns the existing state for an unknown action', () => {
  expect(navigationReducer(initialState, { type: 'UNKNOWN' })).toBe(initialState);
});
