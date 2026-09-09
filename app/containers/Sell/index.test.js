import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import Sell from 'app/containers/Sell';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL } from 'app/constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

const merchantFormData = { name: '', email: '', phoneNumber: '', brand: '', business: '' };

it('renders the become-a-seller form', () => {
  renderWithProviders(<Sell />, {
    preloadedState: { merchant: { merchantFormData, formErrors: {}, isSubmitting: false, isLoading: false } }
  });

  expect(screen.getByText('Become A MERN Store Seller!')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
});

it('shows a loading indicator while isLoading is true', () => {
  const { container } = renderWithProviders(<Sell />, {
    preloadedState: { merchant: { merchantFormData, formErrors: {}, isSubmitting: false, isLoading: true } }
  });

  expect(container.querySelector('.spinner-container')).toBeInTheDocument();
});

it('typing into a field dispatches merchantChange and updates the real store', () => {
  renderWithProviders(<Sell />, {
    preloadedState: { merchant: { merchantFormData, formErrors: {}, isSubmitting: false, isLoading: false } }
  });

  const input = screen.getByPlaceholderText('Your Full Name');
  fireEvent.change(input, { target: { value: 'Jane' } });

  expect(input).toHaveValue('Jane');
});

it('submitting a valid form calls addMerchant, which hits the real GraphQL endpoint', async () => {
  // The success toast itself is rendered by the separately-mounted
  // containers/Notification (see its own tests) — not present here, so this
  // asserts on the real HTTP call instead of a DOM toast.
  mock.onPost(`${API_URL}/graphql`).reply(200, { data: { addMerchant: { success: true, message: 'Application submitted!' } } });

  const validForm = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    phoneNumber: '1234567890',
    brandName: 'Acme',
    business: 'A long enough business description'
  };

  const { container } = renderWithProviders(<Sell />, {
    preloadedState: { merchant: { merchantFormData: validForm, formErrors: {}, isSubmitting: false, isLoading: false } }
  });

  fireEvent.submit(container.querySelector('form'));

  await vi.waitFor(() => expect(mock.history.post).toHaveLength(1));
});
