import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import Customer from 'app/containers/Order/Customer';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL, ROLES } from 'app/constants';

const mock = new MockAdapter(axios);
const GRAPHQL_URL = `${API_URL}/graphql`;

afterEach(() => {
  mock.reset();
});

const order = {
  _id: 'order-1',
  created: '2024-01-01T00:00:00.000Z',
  totalWithTax: 20,
  products: [{ status: 'Processing', product: { imageUrl: '', name: 'Widget' } }]
};

// Both `orders` (plain list) and `orderSearch` land on the same POST
// /api/graphql endpoint, so tests that exercise both in one render need to
// tell them apart by the request body's operation name rather than by URL.
const byOperation = handlers => config => {
  const { query } = JSON.parse(config.data);
  const match = handlers.find(([name]) => query.includes(`query ${name}`));
  return match ? [200, { data: match[1] }] : [500, {}];
};

it('fetches all orders on mount and renders them with pagination when there are multiple pages', async () => {
  mock.onPost(GRAPHQL_URL).reply(200, { data: { orders: { orders: [order], totalPages: 2, currentPage: 1, count: 15 } } });

  renderWithProviders(<Customer history={{ push: vi.fn() }} />, {
    preloadedState: { account: { user: { role: ROLES.Admin } } }
  });

  expect(await screen.findByText('order-1')).toBeInTheDocument();
  expect(screen.getByText('15 orders')).toBeInTheDocument();
  expect(document.querySelector('.pagination')).toBeInTheDocument();
});

it('shows "No orders found." when the list is empty', async () => {
  mock.onPost(GRAPHQL_URL).reply(200, { data: { orders: { orders: [], totalPages: 1, currentPage: 1, count: 0 } } });

  renderWithProviders(<Customer history={{ push: vi.fn() }} />, {
    preloadedState: { account: { user: { role: ROLES.Admin } } }
  });

  expect(await screen.findByText('No orders found.')).toBeInTheDocument();
});

it('navigates to "My Orders" when the action button is clicked (admin only)', async () => {
  mock.onPost(GRAPHQL_URL).reply(200, { data: { orders: { orders: [], totalPages: 1, currentPage: 1, count: 0 } } });
  const history = { push: vi.fn() };

  renderWithProviders(<Customer history={history} />, {
    preloadedState: { account: { user: { role: ROLES.Admin } } }
  });

  await screen.findByText('No orders found.');
  fireEvent.click(screen.getByRole('button', { name: 'My Orders' }));

  expect(history.push).toHaveBeenCalledWith('/dashboard/orders');
});

it('searches orders (2+ chars) server-side and shows the search-scoped count without pagination', async () => {
  mock.onPost(GRAPHQL_URL).reply(
    byOperation([
      ['Orders', { orders: { orders: [order], totalPages: 2, currentPage: 1, count: 15 } }],
      ['OrderSearch', { orderSearch: { orders: [{ ...order, _id: 'order-2' }] } }]
    ])
  );

  renderWithProviders(<Customer history={{ push: vi.fn() }} />, {
    preloadedState: { account: { user: { role: ROLES.Admin } } }
  });

  await screen.findByText('order-1');

  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  fireEvent.change(screen.getByPlaceholderText('Type the complete order ID'), { target: { value: 'or' } });
  vi.advanceTimersByTime(1000);
  vi.useRealTimers();

  expect(await screen.findByText('order-2')).toBeInTheDocument();
  expect(screen.getByText('1 orders')).toBeInTheDocument();
  expect(document.querySelector('.pagination')).not.toBeInTheDocument();
});

it('clears the search (fewer than 2 chars) and falls back to the plain orders list', async () => {
  mock.onPost(GRAPHQL_URL).reply(
    byOperation([
      ['Orders', { orders: { orders: [order], totalPages: 1, currentPage: 1, count: 1 } }],
      ['OrderSearch', { orderSearch: { orders: [{ ...order, _id: 'order-2' }] } }]
    ])
  );

  renderWithProviders(<Customer history={{ push: vi.fn() }} />, {
    preloadedState: { account: { user: { role: ROLES.Admin } } }
  });

  await screen.findByText('order-1');

  const search = screen.getByPlaceholderText('Type the complete order ID');

  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  fireEvent.change(search, { target: { value: 'or' } });
  vi.advanceTimersByTime(1000);
  vi.useRealTimers();
  await screen.findByText('order-2');

  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  fireEvent.change(search, { target: { value: 'o' } });
  vi.advanceTimersByTime(1000);
  vi.useRealTimers();

  expect(await screen.findByText('order-1')).toBeInTheDocument();
});

it('re-fetches the given page via Pagination, scoped to the current page', async () => {
  mock.onPost(GRAPHQL_URL).reply(200, { data: { orders: { orders: [order], totalPages: 2, currentPage: 1, count: 15 } } });

  renderWithProviders(<Customer history={{ push: vi.fn() }} />, {
    preloadedState: { account: { user: { role: ROLES.Admin } } }
  });

  await screen.findByText('order-1');
  fireEvent.click(screen.getByText('2'));

  await vi.waitFor(() => expect(mock.history.post).toHaveLength(2));
});
