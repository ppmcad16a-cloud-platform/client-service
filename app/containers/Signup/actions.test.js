import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { signupChange, signUp } from './actions';
import {
  SIGNUP_CHANGE,
  SIGNUP_RESET,
  SET_SIGNUP_LOADING,
  SET_SIGNUP_SUBMITTING,
  SET_SIGNUP_FORM_ERRORS
} from './constants';
import { SET_AUTH } from '../Authentication/constants';
import { API_URL } from '../../constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
  localStorage.clear();
});

it('signupChange builds a keyed payload', () => {
  expect(signupChange('email', 'a@b.com')).toEqual({
    type: SIGNUP_CHANGE,
    payload: { email: 'a@b.com' }
  });
});

describe('signUp', () => {
  const validUser = {
    email: 'a@b.com',
    password: 'password123',
    firstName: 'Jane',
    lastName: 'Doe'
  };

  it('rejects invalid form data without calling the API', async () => {
    const dispatch = vi.fn();

    await signUp()(dispatch, () => ({ signup: { signupFormData: {} } }));

    // The whole thunk is wrapped in try/finally, so even this early
    // `return dispatch(...)` still runs the finally block's two
    // loading/submitting-off dispatches afterward.
    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toEqual([SET_SIGNUP_FORM_ERRORS, SET_SIGNUP_SUBMITTING, SET_SIGNUP_LOADING]);
  });

  it('registers, stores the token, logs in, and resets the form on success', async () => {
    mock.onPost(`${API_URL}/auth/register`).reply(200, { token: 'Bearer abc123' });
    const dispatch = vi.fn();

    await signUp()(dispatch, () => ({ signup: { signupFormData: validUser } }));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toEqual([
      SET_SIGNUP_SUBMITTING,
      SET_SIGNUP_LOADING,
      SET_AUTH,
      'RNS_SHOW_NOTIFICATION',
      SIGNUP_RESET,
      SET_SIGNUP_SUBMITTING,
      SET_SIGNUP_LOADING
    ]);
    expect(localStorage.getItem('token')).toBe('Bearer abc123');
  });

  it('handles a failed registration and still turns loading/submitting back off', async () => {
    mock.onPost(`${API_URL}/auth/register`).reply(400, { error: 'Email already in use' });
    const dispatch = vi.fn();

    await signUp()(dispatch, () => ({ signup: { signupFormData: validUser } }));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toContain('RNS_SHOW_NOTIFICATION');
    expect(dispatch.mock.calls.at(-1)[0]).toEqual({ type: SET_SIGNUP_LOADING, payload: false });
  });
});
