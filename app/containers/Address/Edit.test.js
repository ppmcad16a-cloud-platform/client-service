import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import Edit from 'app/containers/Address/Edit';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL } from 'app/constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

const history = { goBack: vi.fn() };

afterEach(() => {
  history.goBack.mockClear();
});

it('fetches the address on mount and renders it pre-filled', async () => {
  mock.onGet(`${API_URL}/address/addr-1`).reply(200, {
    address: { _id: 'addr-1', address: '123 Main St', city: 'Springfield', state: 'IL', country: 'US', zipCode: '00000', isDefault: false }
  });

  renderWithProviders(<Edit match={{ params: { id: 'addr-1' } }} history={history} />);

  expect(await screen.findByDisplayValue('123 Main St')).toBeInTheDocument();
});

it('shows "No address found." when the address has no id', async () => {
  mock.onGet(`${API_URL}/address/missing`).reply(404);

  renderWithProviders(<Edit match={{ params: { id: 'missing' } }} history={history} />);

  expect(await screen.findByText('No address found.')).toBeInTheDocument();
});

it('re-fetches when the address id param changes', async () => {
  mock.onGet(`${API_URL}/address/addr-1`).reply(200, {
    address: { _id: 'addr-1', address: '123 Main St', city: 'Springfield', state: 'IL', country: 'US', zipCode: '00000', isDefault: false }
  });

  const { rerender } = renderWithProviders(<Edit match={{ params: { id: 'addr-1' } }} history={history} />);

  await screen.findByDisplayValue('123 Main St');

  mock.onGet(`${API_URL}/address/addr-2`).reply(200, {
    address: { _id: 'addr-2', address: '456 Oak Ave', city: 'Shelbyville', state: 'IL', country: 'US', zipCode: '11111', isDefault: false }
  });

  rerender(<Edit match={{ params: { id: 'addr-2' } }} history={history} />);

  expect(await screen.findByDisplayValue('456 Oak Ave')).toBeInTheDocument();
});

it('the Cancel action goes back', () => {
  renderWithProviders(<Edit match={{ params: { id: 'addr-1' } }} history={history} />);

  fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
  expect(history.goBack).toHaveBeenCalledTimes(1);
});

it('calls deleteAddress with the address id when Delete is clicked', async () => {
  mock.onGet(`${API_URL}/address/addr-1`).reply(200, {
    address: { _id: 'addr-1', address: '123 Main St', city: 'Springfield', state: 'IL', country: 'US', zipCode: '00000', isDefault: false }
  });
  mock.onDelete(`${API_URL}/address/delete/addr-1`).reply(200, { success: true, message: 'Deleted!' });

  renderWithProviders(<Edit match={{ params: { id: 'addr-1' } }} history={history} />);

  await screen.findByDisplayValue('123 Main St');
  fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

  await vi.waitFor(() => expect(mock.history.delete).toHaveLength(1));
});
