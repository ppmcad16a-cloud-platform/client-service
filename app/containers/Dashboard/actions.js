/*
 *
 * Dashboard actions
 *
 */

import { TOGGLE_DASHBOARD_MENU } from './constants';

// Dashboard duck: just the mobile-collapsed sidebar menu's open/closed
// state — the actual per-role page content lives in Admin/Merchant/
// Customer.js.
export const toggleDashboardMenu = () => {
  return {
    type: TOGGLE_DASHBOARD_MENU
  };
};
