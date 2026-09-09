import React from 'react';
import { screen } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import OrderSuccess from 'app/containers/OrderSuccess';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL } from 'app/constants';

const mock = new MockAdapter(axios);
const GRAPHQL_URL = `${API_URL}/graphql`;

afterEach(() => {
  mock.reset();
});

it('fetches the order on mount and shows the confirmation message', async () => {
  mock.onPost(GRAPHQL_URL).reply(200, { data: { order: { _id: 'order-1' } } });

  renderWithProviders(<OrderSuccess match={{ params: { id: 'order-1' } }} />);

  expect(await screen.findByText('Thank you for your order.')).toBeInTheDocument();
  expect(screen.getByText('#order-1', { exact: false })).toBeInTheDocument();
});

it('shows "No order found." when the order has no id', async () => {
  // componentDidMount's real fetchOrder(id) call dispatches loading:true
  // synchronously, overriding any preloaded isLoading:false before this
  // assertion could run — mock the endpoint and await the real
  // fetch-then-render cycle instead of trying to preload past it.
  mock.onPost(GRAPHQL_URL).reply(200, { data: { order: {} } });

  renderWithProviders(<OrderSuccess match={{ params: { id: 'missing' } }} />);

  expect(await screen.findByText('No order found.')).toBeInTheDocument();
});

it('re-fetches when the order id param changes', async () => {
  mock.onPost(GRAPHQL_URL).reply(200, { data: { order: { _id: 'order-1' } } });

  const { rerender } = renderWithProviders(<OrderSuccess match={{ params: { id: 'order-1' } }} />);

  await screen.findByText('Thank you for your order.');

  mock.onPost(GRAPHQL_URL).reply(200, { data: { order: { _id: 'order-2' } } });

  rerender(<OrderSuccess match={{ params: { id: 'order-2' } }} />);

  expect(await screen.findByText('#order-2', { exact: false })).toBeInTheDocument();
});
