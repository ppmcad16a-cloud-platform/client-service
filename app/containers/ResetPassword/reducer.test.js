import resetPasswordReducer from './reducer';
import {
  RESET_PASSWORD_CHANGE,
  RESET_PASSWORD_RESET,
  SET_RESET_PASSWORD_FORM_ERRORS
} from './constants';

const initialState = {
  resetFormData: { password: '', confirmPassword: '' },
  formErrors: {}
};

it('returns the initial state by default', () => {
  expect(resetPasswordReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
});

it('merges a form change into resetFormData', () => {
  const state = resetPasswordReducer(initialState, {
    type: RESET_PASSWORD_CHANGE,
    payload: { password: 'newpass' }
  });
  expect(state.resetFormData).toEqual({ ...initialState.resetFormData, password: 'newpass' });
});

it('sets form errors', () => {
  const errors = { password: ['required'] };
  expect(
    resetPasswordReducer(initialState, { type: SET_RESET_PASSWORD_FORM_ERRORS, payload: errors }).formErrors
  ).toBe(errors);
});

it('resets the form data and errors', () => {
  const dirty = {
    resetFormData: { password: 'x', confirmPassword: 'x' },
    formErrors: { password: ['required'] }
  };
  expect(resetPasswordReducer(dirty, { type: RESET_PASSWORD_RESET })).toEqual(initialState);
});

it('returns the existing state for an unknown action', () => {
  expect(resetPasswordReducer(initialState, { type: 'UNKNOWN' })).toBe(initialState);
});
