import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import List from 'app/containers/Address/List';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL } from 'app/constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

it('fetches addresses on mount and renders them', async () => {
  mock.onGet(`${API_URL}/address`).reply(200, {
    addresses: [{ _id: '1', address: '123 Main St', city: 'Springfield', country: 'US', zipCode: '00000', isDefault: true }]
  });

  renderWithProviders(<List history={{ push: vi.fn() }} />);

  expect(await screen.findByText('Default Delivery Address')).toBeInTheDocument();
});

it('shows "No addresses found." when the list is empty', async () => {
  mock.onGet(`${API_URL}/address`).reply(200, { addresses: [] });

  renderWithProviders(<List history={{ push: vi.fn() }} />);

  expect(await screen.findByText('No addresses found.')).toBeInTheDocument();
});

it('navigates to the add-address page when "Add" is clicked', async () => {
  mock.onGet(`${API_URL}/address`).reply(200, { addresses: [] });
  const history = { push: vi.fn() };

  renderWithProviders(<List history={history} />);

  await screen.findByText('No addresses found.');
  fireEvent.click(screen.getByRole('button', { name: 'Add' }));

  expect(history.push).toHaveBeenCalledWith('/dashboard/address/add');
});
