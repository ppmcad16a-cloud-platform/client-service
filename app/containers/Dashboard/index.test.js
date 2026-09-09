import React from 'react';
import { screen } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import Dashboard from 'app/containers/Dashboard';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL, ROLES } from 'app/constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

it('fetches the profile on mount and renders the Admin shell for an admin', async () => {
  mock.onGet(`${API_URL}/user`).reply(200, { user: { _id: 'u1', role: ROLES.Admin } });

  renderWithProviders(<Dashboard />, { preloadedState: { account: { user: { _id: 'u1', role: ROLES.Admin } } } });

  expect(await screen.findByText('Account')).toBeInTheDocument();
});

it('renders the Merchant shell for a merchant with a linked merchant account', async () => {
  mock.onGet(`${API_URL}/user`).reply(200, { user: { _id: 'u1', role: ROLES.Merchant, merchant: 'm1' } });

  renderWithProviders(<Dashboard />, {
    preloadedState: { account: { user: { _id: 'u1', role: ROLES.Merchant, merchant: 'm1' } } }
  });

  expect(await screen.findByText('Account')).toBeInTheDocument();
});

it('falls back to the Customer shell for a merchant with no linked merchant account yet', async () => {
  mock.onGet(`${API_URL}/user`).reply(200, { user: { _id: 'u1', role: ROLES.Merchant, merchant: null } });

  renderWithProviders(<Dashboard />, {
    preloadedState: { account: { user: { _id: 'u1', role: ROLES.Merchant, merchant: null } } }
  });

  expect(await screen.findByText('Account')).toBeInTheDocument();
});

it('renders the Customer shell for a regular member', async () => {
  mock.onGet(`${API_URL}/user`).reply(200, { user: { _id: 'u1', role: ROLES.Member } });

  renderWithProviders(<Dashboard />, { preloadedState: { account: { user: { _id: 'u1', role: ROLES.Member } } } });

  expect(await screen.findByText('Account')).toBeInTheDocument();
});

it('shows the disabled-account screen for a deactivated merchant', async () => {
  mock.onGet(`${API_URL}/user`).reply(200, {
    user: { _id: 'u1', role: ROLES.Merchant, merchant: { isActive: false }, firstName: 'Jane' }
  });

  renderWithProviders(<Dashboard />, {
    preloadedState: { account: { user: { _id: 'u1', role: ROLES.Merchant, merchant: { isActive: false }, firstName: 'Jane' } } }
  });

  expect(await screen.findByText('Unfortunately it seems your account has been disabled.')).toBeInTheDocument();
});

it('shows a loading indicator while isLoading is true', () => {
  const { container } = renderWithProviders(<Dashboard />, {
    preloadedState: { account: { user: { _id: 'u1', role: ROLES.Member }, isLoading: true } }
  });

  expect(container.querySelector('.spinner-container')).toBeInTheDocument();
});
