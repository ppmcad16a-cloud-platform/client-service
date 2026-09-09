import homepageReducer from './reducer';
import { DEFAULT_ACTION } from './constants';

// Vestigial + buggy duck: DEFAULT_ACTION is never dispatched anywhere in the
// app, but if it ever were, `newState` is declared and never assigned,
// so this would reset state.homepage to undefined.
it('returns the initial (empty) state by default', () => {
  expect(homepageReducer(undefined, { type: '@@INIT' })).toEqual({});
});

it('returns undefined for DEFAULT_ACTION (existing bug: newState is never assigned)', () => {
  expect(homepageReducer({ some: 'state' }, { type: DEFAULT_ACTION })).toBeUndefined();
});

it('returns the existing state for an unknown action', () => {
  const state = { some: 'state' };
  expect(homepageReducer(state, { type: 'UNKNOWN' })).toBe(state);
});
