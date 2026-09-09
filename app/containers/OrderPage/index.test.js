import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import OrderPage from 'app/containers/OrderPage';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL } from 'app/constants';

const mock = new MockAdapter(axios);
const GRAPHQL_URL = `${API_URL}/graphql`;

const history = { push: vi.fn(), goBack: vi.fn() };

afterEach(() => {
  mock.reset();
  history.push.mockClear();
  history.goBack.mockClear();
});

it('fetches the order on mount and renders its details', async () => {
  mock.onPost(GRAPHQL_URL).reply(200, {
    data: { order: { _id: 'order-1', created: '2024-01-01T00:00:00.000Z', total: 10, totalTax: 1, totalWithTax: 11, products: [] } }
  });

  renderWithProviders(<OrderPage match={{ params: { id: 'order-1' } }} history={history} />, {
    preloadedState: { account: { user: { _id: 'me' } } }
  });

  expect(await screen.findByText('order-1')).toBeInTheDocument();
});

it('shows "No order found." when the order has no id', async () => {
  // componentDidMount's real fetchOrder(id) call dispatches loading:true
  // synchronously, overriding any preloaded isLoading:false before this
  // assertion could run — mock the endpoint and await the real
  // fetch-then-render cycle instead of trying to preload past it.
  mock.onPost(GRAPHQL_URL).reply(200, { data: { order: {} } });

  renderWithProviders(<OrderPage match={{ params: { id: 'missing' } }} history={history} />, {
    preloadedState: { account: { user: { _id: 'me' } } }
  });

  expect(await screen.findByText('No order found.')).toBeInTheDocument();
});

it('re-fetches when the order id param changes', async () => {
  mock.onPost(GRAPHQL_URL).reply(200, {
    data: { order: { _id: 'order-1', created: '2024-01-01T00:00:00.000Z', total: 10, totalTax: 1, totalWithTax: 11, products: [] } }
  });

  const { rerender } = renderWithProviders(<OrderPage match={{ params: { id: 'order-1' } }} history={history} />, {
    preloadedState: { account: { user: { _id: 'me' } } }
  });

  await screen.findByText('order-1');

  mock.onPost(GRAPHQL_URL).reply(200, {
    data: { order: { _id: 'order-2', created: '2024-01-02T00:00:00.000Z', total: 20, totalTax: 2, totalWithTax: 22, products: [] } }
  });

  rerender(<OrderPage match={{ params: { id: 'order-2' } }} history={history} />);

  expect(await screen.findByText('order-2')).toBeInTheDocument();
});

it('goes back in history when "Back to orders" is clicked outside the post-checkout success flow', async () => {
  mock.onPost(GRAPHQL_URL).reply(200, {
    data: { order: { _id: 'order-1', created: '2024-01-01T00:00:00.000Z', total: 10, totalTax: 1, totalWithTax: 11, products: [] } }
  });

  renderWithProviders(<OrderPage match={{ params: { id: 'order-1' } }} history={history} />, {
    preloadedState: { account: { user: { _id: 'me' } } }
  });

  await screen.findByText('order-1');
  fireEvent.click(screen.getByRole('button', { name: 'Back to orders' }));

  // jsdom's default URL (http://localhost/) never contains "success".
  expect(history.goBack).toHaveBeenCalledTimes(1);
  expect(history.push).not.toHaveBeenCalled();
});

it('routes to the orders list when arriving via OrderSuccess\'s "?success" link', async () => {
  mock.onPost(GRAPHQL_URL).reply(200, {
    data: { order: { _id: 'order-1', created: '2024-01-01T00:00:00.000Z', total: 10, totalTax: 1, totalWithTax: 11, products: [] } }
  });

  window.history.pushState({}, '', '/order/order-1?success');

  renderWithProviders(<OrderPage match={{ params: { id: 'order-1' } }} history={history} />, {
    preloadedState: { account: { user: { _id: 'me' } } }
  });

  await screen.findByText('order-1');
  fireEvent.click(screen.getByRole('button', { name: 'Back to orders' }));

  expect(history.push).toHaveBeenCalledWith('/dashboard/orders');
  expect(history.goBack).not.toHaveBeenCalled();

  window.history.pushState({}, '', '/');
});
