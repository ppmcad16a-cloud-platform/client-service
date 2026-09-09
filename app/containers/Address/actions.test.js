import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import {
  addressChange,
  addressEditChange,
  handleAddressSelect,
  setAddressLoading,
  fetchAddresses,
  fetchAddress,
  addAddress,
  updateAddress,
  deleteAddress
} from './actions';
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
  SET_ADDRESS_LOADING,
  ADDRESS_SELECT
} from './constants';
import { API_URL } from '../../constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

const validAddress = {
  address: '123 Main St',
  city: 'LA',
  state: 'CA',
  country: 'US',
  zipCode: '90001'
};

it('addressChange builds a keyed payload', () => {
  expect(addressChange('city', 'LA')).toEqual({ type: ADDRESS_CHANGE, payload: { city: 'LA' } });
});

it('addressEditChange builds a keyed payload', () => {
  expect(addressEditChange('city', 'LA')).toEqual({ type: ADDRESS_EDIT_CHANGE, payload: { city: 'LA' } });
});

it('handleAddressSelect is a plain (unused) action', () => {
  expect(handleAddressSelect('x')).toEqual({ type: ADDRESS_SELECT, payload: 'x' });
});

it('setAddressLoading carries the loading flag', () => {
  expect(setAddressLoading(true)).toEqual({ type: SET_ADDRESS_LOADING, payload: true });
});

describe('fetchAddresses', () => {
  it('fetches and stores the address list, toggling loading around it', async () => {
    mock.onGet(`${API_URL}/address`).reply(200, { addresses: [{ _id: '1' }] });
    const dispatch = vi.fn();

    await fetchAddresses()(dispatch, () => ({}));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toEqual([SET_ADDRESS_LOADING, FETCH_ADDRESSES, SET_ADDRESS_LOADING]);
  });

  it('handles a failed fetch', async () => {
    mock.onGet(`${API_URL}/address`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await fetchAddresses()(dispatch, () => ({}));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).not.toContain(FETCH_ADDRESSES);
  });
});

describe('fetchAddress', () => {
  it('fetches a single address', async () => {
    mock.onGet(`${API_URL}/address/1`).reply(200, { address: { _id: '1' } });
    const dispatch = vi.fn();

    await fetchAddress('1')(dispatch, () => ({}));

    expect(dispatch).toHaveBeenCalledWith({ type: FETCH_ADDRESS, payload: { _id: '1' } });
  });

  it('handles a failed fetch', async () => {
    mock.onGet(`${API_URL}/address/1`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await fetchAddress('1')(dispatch, () => ({}));

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' })
    );
  });
});

describe('addAddress', () => {
  const getState = () => ({ address: { addressFormData: validAddress } });

  it('rejects invalid form data without calling the API', async () => {
    const dispatch = vi.fn();

    await addAddress()(dispatch, () => ({ address: { addressFormData: {} } }));

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: SET_ADDRESS_FORM_ERRORS })
    );
  });

  it('creates the address, resets the form, and navigates back', async () => {
    mock.onPost(`${API_URL}/address/add`).reply(200, {
      success: true,
      message: 'Added!',
      address: { _id: '1', ...validAddress }
    });
    const dispatch = vi.fn();

    await addAddress()(dispatch, getState);

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toContain(ADD_ADDRESS);
    expect(types).toContain(RESET_ADDRESS);
    expect(types).toContain('@@router/CALL_HISTORY_METHOD');
  });

  it('handles a failed create', async () => {
    mock.onPost(`${API_URL}/address/add`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await addAddress()(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' })
    );
  });
});

describe('updateAddress', () => {
  const address = { _id: '1', ...validAddress };
  const getState = () => ({ address: { address } });

  it('rejects invalid form data without calling the API', async () => {
    const dispatch = vi.fn();

    await updateAddress()(dispatch, () => ({ address: { address: {} } }));

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: SET_ADDRESS_FORM_EDIT_ERRORS })
    );
  });

  it('updates the address and navigates back', async () => {
    mock.onPut(`${API_URL}/address/1`).reply(200, { success: true, message: 'Updated!' });
    const dispatch = vi.fn();

    await updateAddress()(dispatch, getState);

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toContain('RNS_SHOW_NOTIFICATION');
    expect(types).toContain('@@router/CALL_HISTORY_METHOD');
  });

  it('handles a failed update', async () => {
    mock.onPut(`${API_URL}/address/1`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await updateAddress()(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' })
    );
  });
});

describe('deleteAddress', () => {
  it('deletes the address and navigates back', async () => {
    mock.onDelete(`${API_URL}/address/delete/1`).reply(200, { success: true, message: 'Deleted!' });
    const dispatch = vi.fn();

    await deleteAddress('1')(dispatch, () => ({}));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toContain(REMOVE_ADDRESS);
    expect(types).toContain('@@router/CALL_HISTORY_METHOD');
  });

  it('handles a failed delete', async () => {
    mock.onDelete(`${API_URL}/address/delete/1`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await deleteAddress('1')(dispatch, () => ({}));

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' })
    );
  });
});
