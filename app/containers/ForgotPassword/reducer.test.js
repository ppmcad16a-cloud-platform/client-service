import forgotPasswordReducer from './reducer';
import {
  FORGOT_PASSWORD_CHANGE,
  FORGOT_PASSWORD_RESET,
  SET_FORGOT_PASSWORD_FORM_ERRORS
} from './constants';

const initialState = { forgotFormData: { email: '' }, formErrors: {} };

it('returns the initial state by default', () => {
  expect(forgotPasswordReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
});

it('sets the email field', () => {
  const state = forgotPasswordReducer(initialState, {
    type: FORGOT_PASSWORD_CHANGE,
    payload: 'a@b.com'
  });
  expect(state.forgotFormData).toEqual({ email: 'a@b.com' });
});

it('sets form errors', () => {
  const errors = { email: ['required'] };
  expect(
    forgotPasswordReducer(initialState, { type: SET_FORGOT_PASSWORD_FORM_ERRORS, payload: errors }).formErrors
  ).toBe(errors);
});

it('resets the email field back to empty', () => {
  const dirty = { forgotFormData: { email: 'a@b.com' }, formErrors: { email: ['required'] } };
  const state = forgotPasswordReducer(dirty, { type: FORGOT_PASSWORD_RESET });
  expect(state.forgotFormData).toEqual({ email: '' });
});

it('returns the existing state for an unknown action', () => {
  expect(forgotPasswordReducer(initialState, { type: 'UNKNOWN' })).toBe(initialState);
});
