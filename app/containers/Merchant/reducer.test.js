import merchantReducer from './reducer';
import {
  FETCH_MERCHANTS,
  REMOVE_MERCHANT,
  SET_ADVANCED_FILTERS,
  FETCH_SEARCHED_MERCHANTS,
  MERCHANT_CHANGE,
  SET_MERCHANT_FORM_ERRORS,
  SET_MERCHANTS_LOADING,
  SET_MERCHANTS_SUBMITTING,
  RESET_MERCHANT,
  SIGNUP_CHANGE,
  SET_SIGNUP_FORM_ERRORS,
  SIGNUP_RESET
} from './constants';

const initialState = {
  merchants: [],
  searchedMerchants: [],
  advancedFilters: { totalPages: 1, currentPage: 1, count: 0 },
  merchantFormData: { name: '', email: '', phoneNumber: '', brandName: '', business: '' },
  formErrors: {},
  signupFormData: { email: '', firstName: '', lastName: '', password: '' },
  signupFormErrors: {},
  isLoading: false,
  isSubmitting: false
};

it('returns the initial state by default', () => {
  expect(merchantReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
});

it('stores the fetched merchant list', () => {
  const merchants = [{ _id: '1' }];
  expect(merchantReducer(initialState, { type: FETCH_MERCHANTS, payload: merchants }).merchants).toBe(merchants);
});

it('stores the searched merchant list', () => {
  const merchants = [{ _id: '1' }];
  expect(
    merchantReducer(initialState, { type: FETCH_SEARCHED_MERCHANTS, payload: merchants }).searchedMerchants
  ).toBe(merchants);
});

it('removes a merchant by id', () => {
  const state = merchantReducer(
    { ...initialState, merchants: [{ _id: '1' }, { _id: '2' }] },
    { type: REMOVE_MERCHANT, payload: '1' }
  );
  expect(state.merchants).toEqual([{ _id: '2' }]);
});

it('merges advanced filters', () => {
  const state = merchantReducer(initialState, {
    type: SET_ADVANCED_FILTERS,
    payload: { currentPage: 2 }
  });
  expect(state.advancedFilters).toEqual({ ...initialState.advancedFilters, currentPage: 2 });
});

it('merges a form change into merchantFormData', () => {
  const state = merchantReducer(initialState, { type: MERCHANT_CHANGE, payload: { name: 'Jane' } });
  expect(state.merchantFormData.name).toBe('Jane');
});

it('sets merchant form errors', () => {
  const errors = { name: ['required'] };
  expect(merchantReducer(initialState, { type: SET_MERCHANT_FORM_ERRORS, payload: errors }).formErrors).toBe(errors);
});

it('sets the loading flag', () => {
  expect(merchantReducer(initialState, { type: SET_MERCHANTS_LOADING, payload: true }).isLoading).toBe(true);
});

it('sets the submitting flag', () => {
  expect(merchantReducer(initialState, { type: SET_MERCHANTS_SUBMITTING, payload: true }).isSubmitting).toBe(true);
});

it('resets the merchant form data and errors', () => {
  const dirty = {
    ...initialState,
    merchantFormData: { name: 'Jane', email: 'a@b.com', phoneNumber: '1', brandName: 'x', business: 'y' },
    formErrors: { name: ['required'] }
  };
  const state = merchantReducer(dirty, { type: RESET_MERCHANT });
  expect(state.merchantFormData).toEqual(initialState.merchantFormData);
  expect(state.formErrors).toEqual({});
});

it('merges a form change into signupFormData', () => {
  const state = merchantReducer(initialState, { type: SIGNUP_CHANGE, payload: { firstName: 'Jane' } });
  expect(state.signupFormData.firstName).toBe('Jane');
});

it('sets signup form errors', () => {
  const errors = { firstName: ['required'] };
  expect(
    merchantReducer(initialState, { type: SET_SIGNUP_FORM_ERRORS, payload: errors }).signupFormErrors
  ).toBe(errors);
});

it('resets the signup form data', () => {
  const dirty = {
    ...initialState,
    signupFormData: { email: 'a@b.com', firstName: 'Jane', lastName: 'Doe', password: 'x' }
  };
  const state = merchantReducer(dirty, { type: SIGNUP_RESET });
  expect(state.signupFormData).toEqual(initialState.signupFormData);
});

it('returns the existing state for an unknown action', () => {
  expect(merchantReducer(initialState, { type: 'UNKNOWN' })).toBe(initialState);
});
