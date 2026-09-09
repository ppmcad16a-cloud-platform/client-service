import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import List from 'app/containers/Brand/List';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL, ROLES } from 'app/constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

it('fetches brands on mount and renders them, with a plural title and Add action for an admin', async () => {
  mock.onGet(`${API_URL}/brand`).reply(200, { brands: [{ _id: '1', name: 'Acme', description: 'Fine goods' }] });

  renderWithProviders(<List history={{ push: vi.fn() }} />, {
    preloadedState: { account: { user: { role: ROLES.Admin } } }
  });

  expect(await screen.findByText('Acme')).toBeInTheDocument();
  expect(screen.getByText('Brands')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
});

it('shows a singular title with no Add action for a merchant', async () => {
  mock.onGet(`${API_URL}/brand`).reply(200, { brands: [] });

  renderWithProviders(<List history={{ push: vi.fn() }} />, {
    preloadedState: { account: { user: { role: ROLES.Merchant } } }
  });

  await screen.findByText('No brands found.');
  expect(screen.getByText('Brand')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Add' })).not.toBeInTheDocument();
});

it('navigates to the add-brand page when "Add" is clicked', async () => {
  mock.onGet(`${API_URL}/brand`).reply(200, { brands: [] });
  const history = { push: vi.fn() };

  renderWithProviders(<List history={history} />, {
    preloadedState: { account: { user: { role: ROLES.Admin } } }
  });

  await screen.findByText('No brands found.');
  fireEvent.click(screen.getByRole('button', { name: 'Add' }));

  expect(history.push).toHaveBeenCalledWith('/dashboard/brand/add');
});
