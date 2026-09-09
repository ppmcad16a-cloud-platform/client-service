import signupReducer from './reducer';
import {
  SIGNUP_CHANGE,
  SIGNUP_RESET,
  SET_SIGNUP_LOADING,
  SET_SIGNUP_SUBMITTING,
  SET_SIGNUP_FORM_ERRORS
} from './constants';

const initialState = {
  signupFormData: { email: '', firstName: '', lastName: '', password: '' },
  formErrors: {},
  isSubmitting: false,
  isLoading: false
};

it('returns the initial state by default', () => {
  expect(signupReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
});

it('merges a form change into signupFormData', () => {
  const state = signupReducer(initialState, { type: SIGNUP_CHANGE, payload: { email: 'a@b.com' } });
  expect(state.signupFormData).toEqual({ ...initialState.signupFormData, email: 'a@b.com' });
});

it('sets form errors', () => {
  const errors = { email: ['required'] };
  expect(signupReducer(initialState, { type: SET_SIGNUP_FORM_ERRORS, payload: errors }).formErrors).toBe(errors);
});

it('sets the loading flag', () => {
  expect(signupReducer(initialState, { type: SET_SIGNUP_LOADING, payload: true }).isLoading).toBe(true);
});

it('sets the submitting flag', () => {
  expect(signupReducer(initialState, { type: SET_SIGNUP_SUBMITTING, payload: true }).isSubmitting).toBe(true);
});

it('resets the form data, errors, and loading flag', () => {
  const dirty = {
    signupFormData: { email: 'a@b.com', firstName: 'Jane', lastName: 'Doe', password: 'x' },
    formErrors: { email: ['required'] },
    isSubmitting: true,
    isLoading: true
  };
  const state = signupReducer(dirty, { type: SIGNUP_RESET });
  expect(state.signupFormData).toEqual(initialState.signupFormData);
  expect(state.formErrors).toEqual({});
  expect(state.isLoading).toBe(false);
  expect(state.isSubmitting).toBe(true);
});

it('returns the existing state for an unknown action', () => {
  expect(signupReducer(initialState, { type: 'UNKNOWN' })).toBe(initialState);
});
