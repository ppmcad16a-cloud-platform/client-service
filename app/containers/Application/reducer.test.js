import applicationReducer from './reducer';
import { DEFAULT_ACTION } from './constants';

// Vestigial duck: DEFAULT_ACTION is never actually dispatched anywhere in
// the app, but its reducer branch still needs direct-dispatch coverage.
it('returns the initial (empty) state by default', () => {
  expect(applicationReducer(undefined, { type: '@@INIT' })).toEqual({});
});

it('returns the existing state for DEFAULT_ACTION', () => {
  const state = { some: 'state' };
  expect(applicationReducer(state, { type: DEFAULT_ACTION })).toBe(state);
});

it('returns the existing state for an unknown action', () => {
  const state = { some: 'state' };
  expect(applicationReducer(state, { type: 'UNKNOWN' })).toBe(state);
});
