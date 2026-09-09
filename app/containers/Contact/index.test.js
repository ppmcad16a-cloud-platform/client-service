import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import Contact from 'app/containers/Contact';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL } from 'app/constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

it('renders every field and reports changes', () => {
  renderWithProviders(<Contact />);

  const name = screen.getByPlaceholderText('You Full Name');
  fireEvent.change(name, { target: { value: 'Jane' } });
  expect(name).toHaveValue('Jane');

  const email = screen.getByPlaceholderText('Your Email Address');
  fireEvent.change(email, { target: { value: 'jane@example.com' } });
  expect(email).toHaveValue('jane@example.com');

  const message = screen.getByPlaceholderText('Please Describe Your Message');
  fireEvent.change(message, { target: { value: 'Hello there' } });
  expect(message).toHaveValue('Hello there');
});

it('shows field-level validation errors', () => {
  renderWithProviders(<Contact />, {
    preloadedState: { contact: { contactFormData: {}, formErrors: { name: ['Name is required.'] } } }
  });

  expect(screen.getByText('Name is required.')).toBeInTheDocument();
});

it('submits without a full page reload, calling contactUs which hits the real contact endpoint', async () => {
  mock.onPost(`${API_URL}/contact/add`).reply(200, { success: true, message: 'Message sent!' });

  const validForm = { name: 'Jane', email: 'jane@example.com', message: 'Hello there, this is a message' };

  const { container } = renderWithProviders(<Contact />, {
    preloadedState: { contact: { contactFormData: validForm, formErrors: {} } }
  });

  fireEvent.submit(container.querySelector('form'));

  await vi.waitFor(() => expect(mock.history.post).toHaveLength(1));
});
