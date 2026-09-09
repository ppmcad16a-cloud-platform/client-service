import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { resetPasswordChange, resetPassword, resetAccountPassword } from './actions';
import {
  RESET_PASSWORD_CHANGE,
  RESET_PASSWORD_RESET,
  SET_RESET_PASSWORD_FORM_ERRORS
} from './constants';
import { API_URL } from '../../constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

it('resetPasswordChange builds a keyed payload', () => {
  expect(resetPasswordChange('password', 'x')).toEqual({
    type: RESET_PASSWORD_CHANGE,
    payload: { password: 'x' }
  });
});

const validForm = { password: 'password123', confirmPassword: 'password123' };

describe('resetPassword (token-based flow)', () => {
  it('rejects invalid form data without calling the API', async () => {
    const dispatch = vi.fn();

    await resetPassword('tok')(dispatch, () => ({ resetPassword: { resetFormData: {} } }));

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: SET_RESET_PASSWORD_FORM_ERRORS })
    );
  });

  it('rejects mismatched passwords', async () => {
    const dispatch = vi.fn();

    await resetPassword('tok')(dispatch, () => ({
      resetPassword: { resetFormData: { password: 'password123', confirmPassword: 'different' } }
    }));

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: SET_RESET_PASSWORD_FORM_ERRORS })
    );
  });

  it('redirects to login, shows a toast, and resets the form on success', async () => {
    mock.onPost(`${API_URL}/auth/reset/tok`).reply(200, { success: true, message: 'Changed!' });
    const dispatch = vi.fn();

    await resetPassword('tok')(dispatch, () => ({ resetPassword: { resetFormData: validForm } }));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toEqual([
      '@@router/CALL_HISTORY_METHOD',
      'RNS_SHOW_NOTIFICATION',
      RESET_PASSWORD_RESET
    ]);
  });

  it('does not redirect when the server reports failure, but still resets', async () => {
    mock.onPost(`${API_URL}/auth/reset/tok`).reply(200, { success: false, message: 'Expired token.' });
    const dispatch = vi.fn();

    await resetPassword('tok')(dispatch, () => ({ resetPassword: { resetFormData: validForm } }));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toEqual(['RNS_SHOW_NOTIFICATION', RESET_PASSWORD_RESET]);
  });

  it('handles a failed request with a fixed title', async () => {
    mock.onPost(`${API_URL}/auth/reset/tok`).reply(400, { error: 'Expired token.' });
    const dispatch = vi.fn();

    await resetPassword('tok')(dispatch, () => ({ resetPassword: { resetFormData: validForm } }));

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION', title: 'Please try to reset again!' })
    );
  });
});

describe('resetAccountPassword (logged-in change-password flow)', () => {
  it('rejects invalid form data without calling the API', async () => {
    const dispatch = vi.fn();

    await resetAccountPassword()(dispatch, () => ({ resetPassword: { resetFormData: {} } }));

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: SET_RESET_PASSWORD_FORM_ERRORS })
    );
  });

  it('does not require confirmPassword to match password', async () => {
    mock.onPost(`${API_URL}/auth/reset`).reply(200, { success: true, message: 'Changed!' });
    const dispatch = vi.fn();

    await resetAccountPassword()(dispatch, () => ({
      resetPassword: { resetFormData: { password: 'password123', confirmPassword: 'different123' } }
    }));

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' })
    );
  });

  it('signs the user out on success', async () => {
    mock.onPost(`${API_URL}/auth/reset`).reply(200, { success: true, message: 'Changed!' });
    const dispatch = vi.fn();

    await resetAccountPassword()(dispatch, () => ({ resetPassword: { resetFormData: validForm } }));

    // dispatch(signOut()) hands the plain mock dispatch a thunk function —
    // real thunk middleware would recurse into it, but that's Login/actions'
    // own behavior (already covered by Login/actions.test.js); here it's
    // enough to confirm resetAccountPassword handed off to it at all.
    const calls = dispatch.mock.calls.map(call => call[0]);
    expect(calls.some(action => typeof action === 'function')).toBe(true);
    const types = calls.map(action => action.type);
    expect(types).toContain(RESET_PASSWORD_RESET);
  });

  it('does not sign out when the server reports failure', async () => {
    mock.onPost(`${API_URL}/auth/reset`).reply(200, { success: false, message: 'Wrong password.' });
    const dispatch = vi.fn();

    await resetAccountPassword()(dispatch, () => ({ resetPassword: { resetFormData: validForm } }));

    const calls = dispatch.mock.calls.map(call => call[0]);
    expect(calls.some(action => typeof action === 'function')).toBe(false);
  });

  it('handles a failed request', async () => {
    mock.onPost(`${API_URL}/auth/reset`).reply(400, { error: 'Wrong password.' });
    const dispatch = vi.fn();

    await resetAccountPassword()(dispatch, () => ({ resetPassword: { resetFormData: validForm } }));

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION', title: 'Please try to reset again!' })
    );
  });
});
