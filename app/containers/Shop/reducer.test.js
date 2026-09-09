import productsReducer from './reducer';
import { DEFAULT_ACTION } from './constants';

// Vestigial duck: DEFAULT_ACTION is never dispatched anywhere in the app
// (mounted at state.shop, but nothing reads from it), but the reducer
// branch still needs direct-dispatch coverage.
it('returns the initial (empty) state by default', () => {
  expect(productsReducer(undefined, { type: '@@INIT' })).toEqual({});
});

it('returns a shallow copy of state for DEFAULT_ACTION', () => {
  const state = { some: 'state' };
  expect(productsReducer(state, { type: DEFAULT_ACTION })).toEqual(state);
});

it('returns the existing state for an unknown action', () => {
  const state = { some: 'state' };
  expect(productsReducer(state, { type: 'UNKNOWN' })).toBe(state);
});
