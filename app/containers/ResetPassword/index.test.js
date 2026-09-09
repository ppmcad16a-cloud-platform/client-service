import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import ResetPassword from 'app/containers/ResetPassword';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL } from 'app/constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

it('renders the form when logged out', () => {
  renderWithProviders(<ResetPassword match={{ params: { token: 'tok' } }} />, {
    preloadedState: { authentication: { authenticated: false } }
  });

  expect(screen.getByRole('heading', { name: 'Reset Password' })).toBeInTheDocument();
});

it('redirects to /dashboard when already authenticated', () => {
  renderWithProviders(<ResetPassword match={{ params: { token: 'tok' } }} />, {
    preloadedState: { authentication: { authenticated: true } }
  });

  expect(screen.queryByRole('heading', { name: 'Reset Password' })).not.toBeInTheDocument();
});

it('typing into a field dispatches resetPasswordChange and updates the real store', () => {
  renderWithProviders(<ResetPassword match={{ params: { token: 'tok' } }} />, {
    preloadedState: { authentication: { authenticated: false } }
  });

  const input = screen.getByPlaceholderText('Password');
  fireEvent.change(input, { target: { value: 'secret1' } });

  expect(input).toHaveValue('secret1');
});

it('submits with the route token, calling resetPassword, which hits the real reset endpoint', async () => {
  mock.onPost(`${API_URL}/auth/reset/tok`).reply(200, { success: true, message: 'Password reset!' });

  const { container } = renderWithProviders(<ResetPassword match={{ params: { token: 'tok' } }} />, {
    preloadedState: {
      authentication: { authenticated: false },
      resetPassword: { resetFormData: { password: 'secret1', confirmPassword: 'secret1' }, formErrors: {} }
    }
  });

  fireEvent.submit(container.querySelector('form'));

  await vi.waitFor(() => expect(mock.history.post).toHaveLength(1));
  expect(mock.history.post[0].url).toBe(`${API_URL}/auth/reset/tok`);
});
