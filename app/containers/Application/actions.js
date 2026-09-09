/*
 *
 * Application actions
 *
 */

import { DEFAULT_ACTION } from './constants';

// Vestigial duck, same as containers/Shop's — Application's real behavior
// (auth bootstrap, cart hydration, route table) lives entirely in index.js;
// this reducer/constants pair is unused scaffolding.
export const defaultAction = () => {
  return {
    type: DEFAULT_ACTION
  };
};
