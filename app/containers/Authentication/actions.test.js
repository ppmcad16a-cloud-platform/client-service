import { setAuth, clearAuth } from './actions';
import { SET_AUTH, CLEAR_AUTH } from './constants';

it('setAuth is a plain action', () => {
  expect(setAuth()).toEqual({ type: SET_AUTH });
});

it('clearAuth is a plain action', () => {
  expect(clearAuth()).toEqual({ type: CLEAR_AUTH });
});
