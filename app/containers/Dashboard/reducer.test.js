import dashboardReducer from './reducer';
import { TOGGLE_DASHBOARD_MENU } from './constants';

const initialState = { isMenuOpen: false };

it('returns the initial state by default', () => {
  expect(dashboardReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
});

it('toggles the menu open', () => {
  expect(dashboardReducer(initialState, { type: TOGGLE_DASHBOARD_MENU }).isMenuOpen).toBe(true);
});

it('toggles the menu closed again', () => {
  expect(
    dashboardReducer({ isMenuOpen: true }, { type: TOGGLE_DASHBOARD_MENU }).isMenuOpen
  ).toBe(false);
});

it('returns the existing state for an unknown action', () => {
  expect(dashboardReducer(initialState, { type: 'UNKNOWN' })).toBe(initialState);
});
