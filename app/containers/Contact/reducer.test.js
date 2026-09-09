import contactReducer from './reducer';
import {
  CONTACT_FORM_CHANGE,
  SET_CONTACT_FORM_ERRORS,
  CONTACT_FORM_RESET
} from './constants';

const initialState = {
  contactFormData: { name: '', email: '', message: '' },
  formErrors: {}
};

it('returns the initial state by default', () => {
  expect(contactReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
});

it('merges a form change into contactFormData', () => {
  const state = contactReducer(initialState, {
    type: CONTACT_FORM_CHANGE,
    payload: { name: 'Jane' }
  });
  expect(state.contactFormData).toEqual({ ...initialState.contactFormData, name: 'Jane' });
});

it('sets form errors', () => {
  const errors = { name: ['required'] };
  expect(contactReducer(initialState, { type: SET_CONTACT_FORM_ERRORS, payload: errors }).formErrors).toBe(errors);
});

it('resets the form data and errors', () => {
  const dirty = {
    contactFormData: { name: 'Jane', email: 'a@b.com', message: 'Hi' },
    formErrors: { name: ['required'] }
  };
  expect(contactReducer(dirty, { type: CONTACT_FORM_RESET })).toEqual(initialState);
});

it('returns the existing state for an unknown action', () => {
  expect(contactReducer(initialState, { type: 'UNKNOWN' })).toBe(initialState);
});
