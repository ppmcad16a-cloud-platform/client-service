import loginReducer from './reducer';
import {
  LOGIN_CHANGE,
  LOGIN_RESET,
  SET_LOGIN_LOADING,
  SET_LOGIN_FORM_ERRORS,
  SET_LOGIN_SUBMITTING
} from './constants';

const initialState = {
  loginFormData: { email: '', password: '' },
  formErrors: {},
  isSubmitting: false,
  isLoading: false
};

it('returns the initial state by default', () => {
  expect(loginReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
});

it('merges a form change into loginFormData', () => {
  const state = loginReducer(initialState, { type: LOGIN_CHANGE, payload: { email: 'a@b.com' } });
  expect(state.loginFormData).toEqual({ ...initialState.loginFormData, email: 'a@b.com' });
});

it('sets form errors', () => {
  const errors = { email: ['required'] };
  expect(loginReducer(initialState, { type: SET_LOGIN_FORM_ERRORS, payload: errors }).formErrors).toBe(errors);
});

it('sets the loading flag', () => {
  expect(loginReducer(initialState, { type: SET_LOGIN_LOADING, payload: true }).isLoading).toBe(true);
});

it('sets the submitting flag', () => {
  expect(loginReducer(initialState, { type: SET_LOGIN_SUBMITTING, payload: true }).isSubmitting).toBe(true);
});

it('resets the form data, errors, and loading flag', () => {
  const dirty = {
    loginFormData: { email: 'a@b.com', password: 'x' },
    formErrors: { email: ['required'] },
    isSubmitting: true,
    isLoading: true
  };
  const state = loginReducer(dirty, { type: LOGIN_RESET });
  expect(state.loginFormData).toEqual({ email: '', password: '' });
  expect(state.formErrors).toEqual({});
  expect(state.isLoading).toBe(false);
  // isSubmitting is untouched by LOGIN_RESET.
  expect(state.isSubmitting).toBe(true);
});

it('returns the existing state for an unknown action', () => {
  expect(loginReducer(initialState, { type: 'UNKNOWN' })).toBe(initialState);
});
