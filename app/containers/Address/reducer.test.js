import addressReducer from './reducer';
import {
  FETCH_ADDRESS,
  FETCH_ADDRESSES,
  ADDRESS_CHANGE,
  ADDRESS_EDIT_CHANGE,
  SET_ADDRESS_FORM_ERRORS,
  SET_ADDRESS_FORM_EDIT_ERRORS,
  RESET_ADDRESS,
  ADD_ADDRESS,
  REMOVE_ADDRESS,
  SET_ADDRESS_LOADING
} from './constants';

const initialState = {
  addresses: [],
  addressFormData: {
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    isDefault: false
  },
  address: {
    _id: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    isDefault: false
  },
  formErrors: {},
  editFormErrors: {}
};

it('returns the initial state by default', () => {
  expect(addressReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
});

it('stores the fetched address list', () => {
  const addresses = [{ _id: '1' }, { _id: '2' }];
  const state = addressReducer(initialState, {
    type: FETCH_ADDRESSES,
    payload: addresses
  });
  expect(state.addresses).toBe(addresses);
});

it('stores a single fetched address and clears edit errors', () => {
  const state = addressReducer(
    { ...initialState, editFormErrors: { city: ['required'] } },
    { type: FETCH_ADDRESS, payload: { _id: '1', city: 'LA' } }
  );
  expect(state.address).toEqual({ _id: '1', city: 'LA' });
  expect(state.editFormErrors).toEqual({});
});

it('appends a newly-added address', () => {
  const state = addressReducer(
    { ...initialState, addresses: [{ _id: '1' }] },
    { type: ADD_ADDRESS, payload: { _id: '2' } }
  );
  expect(state.addresses).toEqual([{ _id: '1' }, { _id: '2' }]);
});

it('removes an address by id', () => {
  const state = addressReducer(
    { ...initialState, addresses: [{ _id: '1' }, { _id: '2' }] },
    { type: REMOVE_ADDRESS, payload: '1' }
  );
  expect(state.addresses).toEqual([{ _id: '2' }]);
});

it('merges a form change into addressFormData', () => {
  const state = addressReducer(initialState, {
    type: ADDRESS_CHANGE,
    payload: { city: 'LA' }
  });
  expect(state.addressFormData.city).toBe('LA');
});

it('merges an edit-form change into address', () => {
  const state = addressReducer(initialState, {
    type: ADDRESS_EDIT_CHANGE,
    payload: { city: 'LA' }
  });
  expect(state.address.city).toBe('LA');
});

it('sets add-form errors', () => {
  const errors = { city: ['required'] };
  const state = addressReducer(initialState, {
    type: SET_ADDRESS_FORM_ERRORS,
    payload: errors
  });
  expect(state.formErrors).toBe(errors);
});

it('sets edit-form errors', () => {
  const errors = { city: ['required'] };
  const state = addressReducer(initialState, {
    type: SET_ADDRESS_FORM_EDIT_ERRORS,
    payload: errors
  });
  expect(state.editFormErrors).toBe(errors);
});

it('resets the add-form data and errors', () => {
  const dirty = {
    ...initialState,
    addressFormData: { ...initialState.addressFormData, city: 'LA' },
    formErrors: { city: ['required'] }
  };
  const state = addressReducer(dirty, { type: RESET_ADDRESS });
  expect(state.addressFormData).toEqual(initialState.addressFormData);
  expect(state.formErrors).toEqual({});
});

it('sets the loading flag', () => {
  const state = addressReducer(initialState, {
    type: SET_ADDRESS_LOADING,
    payload: true
  });
  expect(state.isLoading).toBe(true);
});

it('returns the existing state for an unknown action', () => {
  expect(addressReducer(initialState, { type: 'UNKNOWN' })).toBe(initialState);
});
