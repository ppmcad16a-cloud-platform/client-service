/*
 *
 * Homepage actions
 *
 */

import { DEFAULT_ACTION } from './constants';

// Vestigial duck (same pattern as Application/Shop/NavigationMenu) —
// Homepage is entirely static, driven by banners.json, not Redux state.
export const defaultAction = () => {
  return {
    type: DEFAULT_ACTION
  };
};
