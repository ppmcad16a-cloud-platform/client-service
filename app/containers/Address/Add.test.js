import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import Add from 'app/containers/Address/Add';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL } from 'app/constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

it('renders the add-address form with a Cancel action that goes back', () => {
  const history = { goBack: vi.fn() };
  renderWithProviders(<Add history={history} />);

  expect(screen.getByRole('heading', { name: 'Add Address' })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
  expect(history.goBack).toHaveBeenCalledTimes(1);
});

it('typing into a field dispatches addressChange and updates the real store', () => {
  renderWithProviders(<Add history={{ goBack: vi.fn() }} />);

  const input = screen.getByPlaceholderText('Address: Street, House No / Apartment No');
  fireEvent.change(input, { target: { value: '123 Main St' } });

  expect(input).toHaveValue('123 Main St');
});

it('submitting a valid form calls addAddress, which hits the real address/add endpoint', async () => {
  mock.onPost(`${API_URL}/address/add`).reply(200, { success: true, message: 'Address added!', address: { _id: '1' } });

  const validForm = {
    address: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    country: 'US',
    zipCode: '00000',
    isDefault: false
  };

  const { container } = renderWithProviders(<Add history={{ goBack: vi.fn() }} />, {
    preloadedState: { address: { addressFormData: validForm, formErrors: {} } }
  });

  fireEvent.submit(container.querySelector('form'));

  await vi.waitFor(() => expect(mock.history.post).toHaveLength(1));
});
