import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import Signup from 'app/containers/Signup';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL } from 'app/constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

it('renders the form when logged out', () => {
  renderWithProviders(<Signup />, { preloadedState: { authentication: { authenticated: false } } });

  expect(screen.getByRole('heading', { name: 'Sign Up' })).toBeInTheDocument();
});

it('redirects to /dashboard when already authenticated', () => {
  renderWithProviders(<Signup />, { preloadedState: { authentication: { authenticated: true } } });

  expect(screen.queryByRole('heading', { name: 'Sign Up' })).not.toBeInTheDocument();
});

it('shows a loading indicator while isLoading is true', () => {
  const { container } = renderWithProviders(<Signup />, {
    preloadedState: {
      authentication: { authenticated: false },
      signup: { signupFormData: {}, formErrors: {}, isLoading: true, isSubmitting: false }
    }
  });

  expect(container.querySelector('.spinner-container')).toBeInTheDocument();
});

it('disables the Sign Up button while submitting', () => {
  renderWithProviders(<Signup />, {
    preloadedState: {
      authentication: { authenticated: false },
      signup: { signupFormData: {}, formErrors: {}, isLoading: false, isSubmitting: true }
    }
  });

  expect(screen.getByRole('button', { name: 'Sign Up' })).toBeDisabled();
});

it('typing into fields dispatches signupChange and updates the real store', () => {
  renderWithProviders(<Signup />, { preloadedState: { authentication: { authenticated: false } } });

  const email = screen.getByPlaceholderText('Please Enter Your Email');
  fireEvent.change(email, { target: { value: 'jane@example.com' } });
  expect(email).toHaveValue('jane@example.com');

  const firstName = screen.getByPlaceholderText('Please Enter Your First Name');
  fireEvent.change(firstName, { target: { value: 'Jane' } });
  expect(firstName).toHaveValue('Jane');

  const lastName = screen.getByPlaceholderText('Please Enter Your Last Name');
  fireEvent.change(lastName, { target: { value: 'Doe' } });
  expect(lastName).toHaveValue('Doe');

  const password = screen.getByPlaceholderText('Please Enter Your Password');
  fireEvent.change(password, { target: { value: 'secret1' } });
  expect(password).toHaveValue('secret1');
});

it('submits calling signUp, which hits the real register endpoint', async () => {
  mock.onPost(`${API_URL}/auth/register`).reply(200, { success: true, token: 'tok', user: { _id: 'u1' } });

  const validForm = { email: 'jane@example.com', firstName: 'Jane', lastName: 'Doe', password: 'secret1' };

  const { container } = renderWithProviders(<Signup />, {
    preloadedState: {
      authentication: { authenticated: false },
      signup: { signupFormData: validForm, formErrors: {}, isLoading: false, isSubmitting: false }
    }
  });

  fireEvent.submit(container.querySelector('form'));

  await vi.waitFor(() => expect(mock.history.post).toHaveLength(1));
});
