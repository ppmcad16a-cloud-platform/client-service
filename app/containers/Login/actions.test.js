import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { loginChange, login, signOut } from './actions';
import {
  LOGIN_CHANGE,
  LOGIN_RESET,
  SET_LOGIN_LOADING,
  SET_LOGIN_FORM_ERRORS,
  SET_LOGIN_SUBMITTING
} from './constants';
import { SET_AUTH, CLEAR_AUTH } from '../Authentication/constants';
import { CLEAR_ACCOUNT } from '../Account/constants';
import { CLEAR_CART } from '../Cart/constants';
import { API_URL } from '../../constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
  localStorage.clear();
});

it('loginChange builds a keyed payload', () => {
  expect(loginChange('email', 'a@b.com')).toEqual({
    type: LOGIN_CHANGE,
    payload: { email: 'a@b.com' }
  });
});

describe('login', () => {
  const validCreds = { email: 'a@b.com', password: 'password123' };

  it('rejects invalid form data without calling the API', async () => {
    const dispatch = vi.fn();

    await login()(dispatch, () => ({ login: { loginFormData: {} } }));

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: SET_LOGIN_FORM_ERRORS })
    );
    expect(dispatch).toHaveBeenCalledTimes(1);
  });

  it('logs in, stores the token, and resets the form on success', async () => {
    mock.onPost(`${API_URL}/auth/login`).reply(200, {
      token: 'Bearer abc123',
      user: { firstName: 'Jane' }
    });
    const dispatch = vi.fn();

    await login()(dispatch, () => ({ login: { loginFormData: validCreds } }));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toEqual([
      SET_LOGIN_SUBMITTING,
      SET_LOGIN_LOADING,
      SET_AUTH,
      'RNS_SHOW_NOTIFICATION',
      LOGIN_RESET,
      SET_LOGIN_SUBMITTING,
      SET_LOGIN_LOADING
    ]);
    expect(localStorage.getItem('token')).toBe('Bearer abc123');
    expect(axios.defaults.headers.common['Authorization']).toBe('Bearer abc123');
  });

  it('handles a failed login and still turns loading/submitting back off', async () => {
    mock.onPost(`${API_URL}/auth/login`).reply(400, { error: 'Password Incorrect' });
    const dispatch = vi.fn();

    await login()(dispatch, () => ({ login: { loginFormData: validCreds } }));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toContain('RNS_SHOW_NOTIFICATION');
    expect(types.filter(t => t === SET_LOGIN_SUBMITTING)).toHaveLength(2);
    expect(dispatch.mock.calls.at(-1)[0]).toEqual({ type: SET_LOGIN_LOADING, payload: false });
  });
});

describe('signOut', () => {
  it('clears auth/account, redirects to /login, removes the token, and shows a toast (but never clears the cart)', () => {
    localStorage.setItem('token', 'Bearer abc123');
    const dispatch = vi.fn();

    signOut()(dispatch, () => ({}));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toEqual([
      CLEAR_AUTH,
      CLEAR_ACCOUNT,
      '@@router/CALL_HISTORY_METHOD',
      'RNS_SHOW_NOTIFICATION'
    ]);
    expect(types).not.toContain(CLEAR_CART);
    expect(localStorage.getItem('token')).toBeNull();
  });
});
