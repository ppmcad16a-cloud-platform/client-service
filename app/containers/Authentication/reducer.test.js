import authenticationReducer from './reducer';
import { SET_AUTH, CLEAR_AUTH } from './constants';

const initialState = { authenticated: false, isLoading: false };

it('returns the initial state by default', () => {
  expect(authenticationReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
});

it('sets authenticated to true', () => {
  const state = authenticationReducer(initialState, { type: SET_AUTH });
  expect(state.authenticated).toBe(true);
});

it('clears authenticated back to false', () => {
  const state = authenticationReducer(
    { ...initialState, authenticated: true },
    { type: CLEAR_AUTH }
  );
  expect(state.authenticated).toBe(false);
});

it('returns the existing state for an unknown action', () => {
  expect(authenticationReducer(initialState, { type: 'UNKNOWN' })).toBe(initialState);
});
