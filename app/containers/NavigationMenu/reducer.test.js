import navigationMenuReducer from './reducer';
import { DEFAULT_ACTION } from './constants';

// Vestigial duck: DEFAULT_ACTION is never dispatched anywhere in the app,
// but the reducer branch still needs direct-dispatch coverage.
it('returns the initial (empty) state by default', () => {
  expect(navigationMenuReducer(undefined, { type: '@@INIT' })).toEqual({});
});

it('returns a shallow copy of state for DEFAULT_ACTION', () => {
  const state = { some: 'state' };
  expect(navigationMenuReducer(state, { type: DEFAULT_ACTION })).toEqual(state);
});

it('returns the existing state for an unknown action', () => {
  const state = { some: 'state' };
  expect(navigationMenuReducer(state, { type: 'UNKNOWN' })).toBe(state);
});
