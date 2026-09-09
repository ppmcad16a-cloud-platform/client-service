/*
 *
 * NavigationMenu actions
 *
 */

import { DEFAULT_ACTION } from './constants';

// Vestigial duck (same pattern as Application/Shop) — NavigationMenu reads
// its state from the Navigation and Category ducks instead; this
// reducer/constants pair is unused.
export const defaultAction = () => {
  return {
    type: DEFAULT_ACTION
  };
};
