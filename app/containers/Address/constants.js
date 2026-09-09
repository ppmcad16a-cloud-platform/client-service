/*
 *
 * Address constants
 * Action-type strings for the Address duck.
 *
 */

export const FETCH_ADDRESS = 'src/Address/FETCH_ADDRESS';
export const FETCH_ADDRESSES = 'src/Address/FETCH_ADDRESSES';
export const ADDRESS_CHANGE = 'src/Address/ADDRESS_CHANGE';
export const ADDRESS_EDIT_CHANGE = 'src/Address/ADDRESS_EDIT_CHANGE';
export const SET_ADDRESS_FORM_ERRORS = 'src/Address/SET_ADDRESS_FORM_ERRORS';
export const SET_ADDRESS_FORM_EDIT_ERRORS =
  'src/Address/SET_ADDRESS_FORM_EDIT_ERRORS';
export const RESET_ADDRESS = 'src/Address/RESET_ADDRESS';
export const ADD_ADDRESS = 'src/Address/ADD_ADDRESS';
export const REMOVE_ADDRESS = 'src/Address/REMOVE_ADDRESS';
export const SET_ADDRESS_LOADING = 'src/Address/SET_ADDRESS_LOADING';
// Copy/paste leftover from Brand's constants (which doesn't even have a
// BRAND_SELECT itself) — still a unique string, and unused either way
// (see actions.js#handleAddressSelect).
export const ADDRESS_SELECT = 'src/Brand/BRAND_SELECT';
