import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import {
  accountChange,
  clearAccount,
  setProfileLoading,
  fetchProfile,
  updateProfile
} from './actions';
import { ACCOUNT_CHANGE, FETCH_PROFILE, CLEAR_ACCOUNT, SET_PROFILE_LOADING } from './constants';
import { API_URL } from '../../constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

it('accountChange builds a keyed payload', () => {
  expect(accountChange('firstName', 'Jane')).toEqual({
    type: ACCOUNT_CHANGE,
    payload: { firstName: 'Jane' }
  });
});

it('clearAccount is a plain action', () => {
  expect(clearAccount()).toEqual({ type: CLEAR_ACCOUNT });
});

it('setProfileLoading carries the loading flag', () => {
  expect(setProfileLoading(true)).toEqual({ type: SET_PROFILE_LOADING, payload: true });
});

describe('fetchProfile', () => {
  it('fetches and stores the profile, toggling loading around it', async () => {
    mock.onGet(`${API_URL}/user/me`).reply(200, { user: { firstName: 'Jane' } });
    const dispatch = vi.fn();

    await fetchProfile()(dispatch, () => ({}));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toEqual([SET_PROFILE_LOADING, FETCH_PROFILE, SET_PROFILE_LOADING]);
    expect(dispatch.mock.calls[1][0].payload).toEqual({ firstName: 'Jane' });
    expect(dispatch.mock.calls[2][0].payload).toBe(false);
  });

  it('handles a failed fetch and still turns loading back off', async () => {
    mock.onGet(`${API_URL}/user/me`).reply(400, { error: 'Bad request' });
    const dispatch = vi.fn();

    await fetchProfile()(dispatch, () => ({}));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types[0]).toBe(SET_PROFILE_LOADING);
    expect(types[types.length - 1]).toBe(SET_PROFILE_LOADING);
    expect(dispatch.mock.calls[dispatch.mock.calls.length - 1][0].payload).toBe(false);
  });
});

describe('updateProfile', () => {
  it('saves the profile and shows a success toast', async () => {
    mock.onPut(`${API_URL}/user`).reply(200, {
      message: 'Updated!',
      user: { firstName: 'Jane' }
    });
    const dispatch = vi.fn();
    const getState = () => ({ account: { user: { firstName: 'Jane' } } });

    await updateProfile()(dispatch, getState);

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toContain(FETCH_PROFILE);
    expect(types).toContain('RNS_SHOW_NOTIFICATION');
  });

  it('handles a failed update', async () => {
    mock.onPut(`${API_URL}/user`).reply(400, { error: 'Bad request' });
    const dispatch = vi.fn();
    const getState = () => ({ account: { user: {} } });

    await updateProfile()(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION', message: 'Bad request' })
    );
  });
});
