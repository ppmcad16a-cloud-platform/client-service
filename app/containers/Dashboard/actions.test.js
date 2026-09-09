import { toggleDashboardMenu } from './actions';
import { TOGGLE_DASHBOARD_MENU } from './constants';

it('toggleDashboardMenu is a plain action', () => {
  expect(toggleDashboardMenu()).toEqual({ type: TOGGLE_DASHBOARD_MENU });
});
