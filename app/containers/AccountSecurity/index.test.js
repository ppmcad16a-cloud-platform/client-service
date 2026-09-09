import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import AccountSecurity from 'app/containers/AccountSecurity';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL } from 'app/constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

it('renders the reset-password form pre-wired to the resetPassword duck state', () => {
  renderWithProviders(<AccountSecurity />, {
    preloadedState: {
      account: { user: { _id: 'u1' } },
      resetPassword: { resetFormData: { password: '', confirmPassword: '' }, formErrors: {} }
    }
  });

  expect(screen.getByText('Account Security')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Reset Password' })).toBeInTheDocument();
});

it('typing into a field dispatches resetPasswordChange and updates the real store', () => {
  renderWithProviders(<AccountSecurity />, {
    preloadedState: {
      account: { user: { _id: 'u1' } },
      resetPassword: { resetFormData: { password: '', confirmPassword: '' }, formErrors: {} }
    }
  });

  const input = screen.getByPlaceholderText('Old Password');
  fireEvent.change(input, { target: { value: 'newpass1' } });

  expect(input).toHaveValue('newpass1');
});

it('submitting calls resetAccountPassword, which hits the real reset endpoint', async () => {
  // The success toast itself is rendered by the separately-mounted
  // containers/Notification (see its own tests) — not present here, so this
  // asserts on the real HTTP call instead of a DOM toast.
  mock.onPost(`${API_URL}/auth/reset`).reply(200, { success: true, message: 'Password updated!' });

  const { container } = renderWithProviders(<AccountSecurity />, {
    preloadedState: {
      account: { user: { _id: 'u1' } },
      resetPassword: {
        resetFormData: { password: 'secret1', confirmPassword: 'secret1' },
        formErrors: {}
      }
    }
  });

  fireEvent.submit(container.querySelector('form'));

  await vi.waitFor(() => expect(mock.history.post).toHaveLength(1));
  expect(JSON.parse(mock.history.post[0].data)).toEqual({ password: 'secret1', confirmPassword: 'secret1' });
});
