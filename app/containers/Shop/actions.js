/*
 *
 * Shop actions
 *
 */

import { DEFAULT_ACTION } from './constants';

// Vestigial duck: Shop's actual data (storeProducts, advancedFilters) all
// lives in the Product duck instead — this file/reducer.js/constants.js are
// unused boilerplate left over from scaffolding a new container, not a real
// piece of state anything reads.
export const defaultAction = () => {
  return {
    type: DEFAULT_ACTION
  };
};
