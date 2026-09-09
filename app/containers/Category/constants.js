/*
 *
 * Category constants
 * Action-type strings for the Category duck.
 *
 */

export const FETCH_CATEGORIES = 'src/Category/FETCH_CATEGORIES';
export const FETCH_STORE_CATEGORIES = 'src/Category/FETCH_STORE_CATEGORIES';
export const FETCH_CATEGORY = 'src/Category/FETCH_CATEGORY';
export const CATEGORY_CHANGE = 'src/Category/CATEGORY_CHANGE';
export const CATEGORY_EDIT_CHANGE = 'src/Category/CATEGORY_EDIT_CHANGE';
export const SET_CATEGORY_FORM_ERRORS = 'src/Category/SET_CATEGORY_FORM_ERRORS';
export const SET_CATEGORY_FORM_EDIT_ERRORS =
  'src/Category/SET_CATEGORY_FORM_EDIT_ERRORS';
export const RESET_CATEGORY = 'src/Category/RESET_CATEGORY';
// Exported but never imported by actions.js — see the note on
// categorySelect() there.
export const CATEGORY_SELECT = 'src/Category/CATEGORY_SELECT';
export const ADD_CATEGORY = 'src/Category/ADD_CATEGORY';
export const REMOVE_CATEGORY = 'src/Category/REMOVE_CATEGORY';
// Namespaced as 'src/Product/...' rather than 'src/Category/...' — a
// copy/paste leftover; still a unique string so it works fine, just
// mislabeled.
export const SET_CATEGORIES_LOADING = 'src/Product/SET_CATEGORIES_LOADING';
