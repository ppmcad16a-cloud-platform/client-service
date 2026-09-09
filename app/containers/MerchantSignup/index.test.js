import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import MerchantSignup from 'app/containers/MerchantSignup';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL } from 'app/constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

it('pre-fills the email field from the ?email= query param on mount', () => {
  renderWithProviders(
    <MerchantSignup location={{ search: '?email=jane@example.com' }} match={{ params: { token: 'tok' } }} />
  );

  expect(screen.getByPlaceholderText('Please Enter Your Email')).toHaveValue('jane@example.com');
});

it('reports changes for the other fields', () => {
  renderWithProviders(
    <MerchantSignup location={{ search: '?email=jane@example.com' }} match={{ params: { token: 'tok' } }} />
  );

  const firstName = screen.getByPlaceholderText('Please Enter Your First Name');
  fireEvent.change(firstName, { target: { value: 'Jane' } });
  expect(firstName).toHaveValue('Jane');

  const lastName = screen.getByPlaceholderText('Please Enter Your Last Name');
  fireEvent.change(lastName, { target: { value: 'Doe' } });
  expect(lastName).toHaveValue('Doe');

  const password = screen.getByPlaceholderText('Please Enter Your Password');
  fireEvent.change(password, { target: { value: 'secret1' } });
  expect(password).toHaveValue('secret1');

  const email = screen.getByPlaceholderText('Please Enter Your Email');
  fireEvent.change(email, { target: { value: 'jane2@example.com' } });
  expect(email).toHaveValue('jane2@example.com');
});

it('shows field-level validation errors', () => {
  renderWithProviders(
    <MerchantSignup location={{ search: '?email=jane@example.com' }} match={{ params: { token: 'tok' } }} />,
    { preloadedState: { merchant: { signupFormData: {}, signupFormErrors: { firstName: ['First Name is required.'] } } } }
  );

  expect(screen.getByText('First Name is required.')).toBeInTheDocument();
});

it('submits the token to the real merchant-signup endpoint', async () => {
  mock.onPost(`${API_URL}/graphql`).reply(200, { data: { merchantSignup: { success: true } } });

  const validForm = {
    email: 'jane@example.com',
    password: 'secret1',
    firstName: 'Jane',
    lastName: 'Doe'
  };

  const { container } = renderWithProviders(
    <MerchantSignup location={{ search: '?email=jane@example.com' }} match={{ params: { token: 'tok' } }} />,
    { preloadedState: { merchant: { signupFormData: validForm, signupFormErrors: {} } } }
  );

  fireEvent.submit(container.querySelector('form'));

  await vi.waitFor(() => expect(mock.history.post).toHaveLength(1));
  expect(mock.history.post[0].url).toBe(`${API_URL}/graphql`);
  expect(JSON.parse(mock.history.post[0].data).variables).toEqual({ token: 'tok', ...validForm });
});
