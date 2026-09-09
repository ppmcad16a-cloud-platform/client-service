/*
 *
 * Homepage reducer
 * Unused (see actions.js) — and buggy if it ever were dispatched: `newState`
 * is declared but never assigned, so DEFAULT_ACTION would reset
 * state.homepage to undefined rather than leaving it alone.
 *
 */

import { DEFAULT_ACTION } from './constants';

const initialState = {};

const homepageReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case DEFAULT_ACTION:
      return newState;
    default:
      return state;
  }
};

export default homepageReducer;
