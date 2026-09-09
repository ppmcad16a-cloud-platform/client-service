import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import Login from 'app/containers/Login';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL } from 'app/constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

it('renders the form when logged out', () => {
  renderWithProviders(<Login history={{ push: vi.fn() }} />, {
    preloadedState: { authentication: { authenticated: false } }
  });

  expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
});

it('redirects to /dashboard when already authenticated', () => {
  renderWithProviders(<Login history={{ push: vi.fn() }} />, {
    preloadedState: { authentication: { authenticated: true } }
  });

  expect(screen.queryByRole('heading', { name: 'Login' })).not.toBeInTheDocument();
});

it('shows a loading indicator while isLoading is true', () => {
  const { container } = renderWithProviders(<Login history={{ push: vi.fn() }} />, {
    preloadedState: { authentication: { authenticated: false }, login: { loginFormData: {}, formErrors: {}, isLoading: true, isSubmitting: false } }
  });

  expect(container.querySelector('.spinner-container')).toBeInTheDocument();
});

it('disables the Login button while submitting', () => {
  renderWithProviders(<Login history={{ push: vi.fn() }} />, {
    preloadedState: { authentication: { authenticated: false }, login: { loginFormData: {}, formErrors: {}, isLoading: false, isSubmitting: true } }
  });

  expect(screen.getByRole('button', { name: 'Login' })).toBeDisabled();
});

it('typing into fields dispatches loginChange and updates the real store', () => {
  renderWithProviders(<Login history={{ push: vi.fn() }} />, {
    preloadedState: { authentication: { authenticated: false } }
  });

  const email = screen.getByPlaceholderText('Please Enter Your Email');
  fireEvent.change(email, { target: { value: 'jane@example.com' } });
  expect(email).toHaveValue('jane@example.com');

  const password = screen.getByPlaceholderText('Please Enter Your Password');
  fireEvent.change(password, { target: { value: 'secret1' } });
  expect(password).toHaveValue('secret1');
});

it('navigates to /register when "Create an account" is clicked', () => {
  const history = { push: vi.fn() };
  renderWithProviders(<Login history={history} />, {
    preloadedState: { authentication: { authenticated: false } }
  });

  fireEvent.click(screen.getByRole('button', { name: 'Create an account' }));
  expect(history.push).toHaveBeenCalledWith('/register');
});

it('submits calling login, which hits the real login endpoint', async () => {
  mock.onPost(`${API_URL}/auth/login`).reply(200, { success: true, token: 'tok', user: { _id: 'u1' } });

  const validForm = { email: 'jane@example.com', password: 'secret1' };

  const { container } = renderWithProviders(<Login history={{ push: vi.fn() }} />, {
    preloadedState: {
      authentication: { authenticated: false },
      login: { loginFormData: validForm, formErrors: {}, isLoading: false, isSubmitting: false }
    }
  });

  fireEvent.submit(container.querySelector('form'));

  await vi.waitFor(() => expect(mock.history.post).toHaveLength(1));
});
