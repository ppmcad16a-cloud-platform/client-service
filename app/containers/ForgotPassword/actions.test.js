import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { forgotPasswordChange, forgotPassowrd } from './actions';
import {
  FORGOT_PASSWORD_CHANGE,
  FORGOT_PASSWORD_RESET,
  SET_FORGOT_PASSWORD_FORM_ERRORS
} from './constants';
import { API_URL } from '../../constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

it('forgotPasswordChange carries the raw value (not a keyed object)', () => {
  expect(forgotPasswordChange('email', 'a@b.com')).toEqual({
    type: FORGOT_PASSWORD_CHANGE,
    payload: 'a@b.com'
  });
});

describe('forgotPassowrd', () => {
  it('rejects invalid form data without calling the API', async () => {
    const dispatch = vi.fn();

    await forgotPassowrd()(dispatch, () => ({ forgotPassword: { forgotFormData: { email: '' } } }));

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: SET_FORGOT_PASSWORD_FORM_ERRORS })
    );
  });

  it('redirects to login, shows a toast, and resets the form on success', async () => {
    mock.onPost(`${API_URL}/auth/forgot`).reply(200, { success: true, message: 'Check your email!' });
    const dispatch = vi.fn();

    await forgotPassowrd()(dispatch, () => ({
      forgotPassword: { forgotFormData: { email: 'a@b.com' } }
    }));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toEqual(['@@router/CALL_HISTORY_METHOD', 'RNS_SHOW_NOTIFICATION', FORGOT_PASSWORD_RESET]);
  });

  it('still shows a toast and resets the form even when the server reports failure', async () => {
    mock.onPost(`${API_URL}/auth/forgot`).reply(200, { success: false, message: 'No user found.' });
    const dispatch = vi.fn();

    await forgotPassowrd()(dispatch, () => ({
      forgotPassword: { forgotFormData: { email: 'a@b.com' } }
    }));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toEqual(['RNS_SHOW_NOTIFICATION', FORGOT_PASSWORD_RESET]);
  });

  it('handles a failed request with a fixed title', async () => {
    mock.onPost(`${API_URL}/auth/forgot`).reply(400, { error: 'No user found.' });
    const dispatch = vi.fn();

    await forgotPassowrd()(dispatch, () => ({
      forgotPassword: { forgotFormData: { email: 'a@b.com' } }
    }));

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION', title: 'Please try again!' })
    );
  });
});
