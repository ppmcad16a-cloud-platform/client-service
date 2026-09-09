import React from 'react';
import { screen } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import Order from 'app/containers/Order';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL, ROLES } from 'app/constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

it('renders "Your Orders" at /dashboard/orders', async () => {
  mock.onPost(`${API_URL}/graphql`).reply(200, {
    data: { myOrders: { orders: [], totalPages: 1, currentPage: 1, count: 0 } }
  });

  renderWithProviders(<Order />, {
    route: '/dashboard/orders',
    preloadedState: { account: { user: { role: ROLES.Member } } }
  });

  expect(await screen.findByText('Your Orders')).toBeInTheDocument();
});

it('renders "Customer Orders" at /dashboard/orders/customers for an admin', async () => {
  mock.onPost(`${API_URL}/graphql`).reply(200, {
    data: { orders: { orders: [], totalPages: 1, currentPage: 1, count: 0 } }
  });

  renderWithProviders(<Order />, {
    route: '/dashboard/orders/customers',
    preloadedState: { account: { user: { role: ROLES.Admin } } }
  });

  expect(await screen.findByText('Customer Orders')).toBeInTheDocument();
});

it('renders Page404 at /dashboard/orders/customers for a non-admin (route is gated out)', () => {
  renderWithProviders(<Order />, {
    route: '/dashboard/orders/customers',
    preloadedState: { account: { user: { role: ROLES.Member } } }
  });

  expect(screen.getByText('The page you are looking for was not found.')).toBeInTheDocument();
});
