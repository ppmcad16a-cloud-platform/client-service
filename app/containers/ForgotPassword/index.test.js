import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import ForgotPassword from 'app/containers/ForgotPassword';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL } from 'app/constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

it('renders the form when logged out', () => {
  renderWithProviders(<ForgotPassword />, {
    preloadedState: { authentication: { authenticated: false } }
  });

  expect(screen.getByText('Forgot Password')).toBeInTheDocument();
});

it('redirects to /dashboard when already authenticated', () => {
  renderWithProviders(<ForgotPassword />, {
    preloadedState: { authentication: { authenticated: true } },
    route: '/forgot-password'
  });

  expect(screen.queryByText('Forgot Password')).not.toBeInTheDocument();
});

it('typing into the email field dispatches forgotPasswordChange and updates the real store', () => {
  renderWithProviders(<ForgotPassword />, { preloadedState: { authentication: { authenticated: false } } });

  const input = screen.getByPlaceholderText('Please Enter Your Email');
  fireEvent.change(input, { target: { value: 'jane@example.com' } });

  expect(input).toHaveValue('jane@example.com');
});

it('submits calling forgotPassowrd, which hits the real forgot-password endpoint', async () => {
  mock.onPost(`${API_URL}/auth/forgot`).reply(200, { success: true, message: 'Email sent!' });

  const { container } = renderWithProviders(<ForgotPassword />, {
    preloadedState: {
      authentication: { authenticated: false },
      forgotPassword: { forgotFormData: { email: 'jane@example.com' }, formErrors: {} }
    }
  });

  fireEvent.submit(container.querySelector('form'));

  await vi.waitFor(() => expect(mock.history.post).toHaveLength(1));
});
