import cartReducer from './reducer';
import {
  HANDLE_CART,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  HANDLE_CART_TOTAL,
  SET_CART_ID,
  CLEAR_CART
} from './constants';

const initialState = { cartItems: [], cartTotal: 0, cartId: '' };

it('returns the initial state by default', () => {
  expect(cartReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
});

it('adds an item to the cart', () => {
  const state = cartReducer(initialState, { type: ADD_TO_CART, payload: { _id: '1' } });
  expect(state.cartItems).toEqual([{ _id: '1' }]);
});

it('removes an item from the cart by id', () => {
  const state = cartReducer(
    { ...initialState, cartItems: [{ _id: '1' }, { _id: '2' }] },
    { type: REMOVE_FROM_CART, payload: { _id: '1' } }
  );
  expect(state.cartItems).toEqual([{ _id: '2' }]);
});

it('sets the cart total', () => {
  const state = cartReducer(initialState, { type: HANDLE_CART_TOTAL, payload: 42 });
  expect(state.cartTotal).toBe(42);
});

it('replaces cart items/total/id all at once', () => {
  const state = cartReducer(initialState, {
    type: HANDLE_CART,
    payload: { cartItems: [{ _id: '1' }], cartTotal: 10, cartId: 'abc' }
  });
  expect(state).toEqual({ cartItems: [{ _id: '1' }], cartTotal: 10, cartId: 'abc' });
});

it('sets the cart id', () => {
  const state = cartReducer(initialState, { type: SET_CART_ID, payload: 'abc' });
  expect(state.cartId).toBe('abc');
});

it('clears the cart back to empty', () => {
  const dirty = { cartItems: [{ _id: '1' }], cartTotal: 10, cartId: 'abc' };
  expect(cartReducer(dirty, { type: CLEAR_CART })).toEqual(initialState);
});

it('returns the existing state for an unknown action', () => {
  expect(cartReducer(initialState, { type: 'UNKNOWN' })).toBe(initialState);
});
