import React from 'react';
import { screen } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import Merchant from 'app/containers/Merchant';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL, ROLES } from 'app/constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

it('renders the merchant list at /dashboard/merchant', () => {
  mock.onPost(`${API_URL}/graphql`).reply(200, {
    data: { merchants: { merchants: [], totalPages: 1, currentPage: 1, count: 0 } }
  });

  renderWithProviders(<Merchant />, {
    route: '/dashboard/merchant',
    preloadedState: { account: { user: { role: ROLES.Admin } } }
  });

  expect(screen.getByText('Merchants')).toBeInTheDocument();
});

it('renders the add-merchant form at /dashboard/merchant/add for an admin', () => {
  renderWithProviders(<Merchant />, {
    route: '/dashboard/merchant/add',
    preloadedState: { account: { user: { role: ROLES.Admin } } }
  });

  expect(screen.getByRole('heading', { name: 'Add Merchant' })).toBeInTheDocument();
});

it('renders Page404 at /dashboard/merchant/add for a non-admin (route is gated out)', () => {
  renderWithProviders(<Merchant />, {
    route: '/dashboard/merchant/add',
    preloadedState: { account: { user: { role: ROLES.Merchant } } }
  });

  expect(screen.getByText('The page you are looking for was not found.')).toBeInTheDocument();
});
