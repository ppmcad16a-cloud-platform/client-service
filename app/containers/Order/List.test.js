import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import List from 'app/containers/Order/List';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL, ROLES } from 'app/constants';

const mock = new MockAdapter(axios);
const GRAPHQL_URL = `${API_URL}/graphql`;

afterEach(() => {
  mock.reset();
});

const order = {
  _id: 'order-abc',
  created: '2024-01-01T00:00:00.000Z',
  totalWithTax: 20,
  products: [{ status: 'Processing', product: { imageUrl: '', name: 'Widget' } }]
};

it("fetches the caller's own orders on mount and renders them with pagination when there are multiple pages", async () => {
  mock.onPost(GRAPHQL_URL).reply(200, { data: { myOrders: { orders: [order], totalPages: 2, currentPage: 1, count: 15 } } });

  renderWithProviders(<List history={{ push: vi.fn() }} />, {
    preloadedState: { account: { user: { role: ROLES.Member } } }
  });

  expect(await screen.findByText('order-abc')).toBeInTheDocument();
  expect(screen.getByText('15 orders')).toBeInTheDocument();
  expect(document.querySelector('.pagination')).toBeInTheDocument();
});

it('shows "You have no orders yet." when the list is empty', async () => {
  mock.onPost(GRAPHQL_URL).reply(200, { data: { myOrders: { orders: [], totalPages: 1, currentPage: 1, count: 0 } } });

  renderWithProviders(<List history={{ push: vi.fn() }} />, {
    preloadedState: { account: { user: { role: ROLES.Member } } }
  });

  expect(await screen.findByText('You have no orders yet.')).toBeInTheDocument();
});

it('shows a "Customer Orders" shortcut for an admin, navigating on click', async () => {
  mock.onPost(GRAPHQL_URL).reply(200, { data: { myOrders: { orders: [], totalPages: 1, currentPage: 1, count: 0 } } });
  const history = { push: vi.fn() };

  renderWithProviders(<List history={history} />, {
    preloadedState: { account: { user: { role: ROLES.Admin } } }
  });

  await screen.findByText('You have no orders yet.');
  fireEvent.click(screen.getByRole('button', { name: 'Customer Orders' }));

  expect(history.push).toHaveBeenCalledWith('/dashboard/orders/customers');
});

it('hides the "Customer Orders" shortcut for a non-admin', async () => {
  mock.onPost(GRAPHQL_URL).reply(200, { data: { myOrders: { orders: [], totalPages: 1, currentPage: 1, count: 0 } } });

  renderWithProviders(<List history={{ push: vi.fn() }} />, {
    preloadedState: { account: { user: { role: ROLES.Member } } }
  });

  await screen.findByText('You have no orders yet.');
  expect(screen.queryByRole('button', { name: 'Customer Orders' })).not.toBeInTheDocument();
});

it('filters the already-loaded orders client-side (2+ chars) by id substring', async () => {
  mock.onPost(GRAPHQL_URL).reply(200, {
    data: {
      myOrders: {
        orders: [order, { ...order, _id: 'order-xyz' }],
        totalPages: 1,
        currentPage: 1,
        count: 2
      }
    }
  });

  renderWithProviders(<List history={{ push: vi.fn() }} />, {
    preloadedState: { account: { user: { role: ROLES.Member } } }
  });

  await screen.findByText('order-abc');

  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  fireEvent.change(screen.getByPlaceholderText('Type the complete order ID'), { target: { value: 'abc' } });
  vi.advanceTimersByTime(1000);
  vi.useRealTimers();

  expect(await screen.findByText('1 orders')).toBeInTheDocument();
  expect(screen.queryByText('order-xyz')).not.toBeInTheDocument();
});

it('clears the client-side search filter (fewer than 2 chars)', async () => {
  mock.onPost(GRAPHQL_URL).reply(200, {
    data: {
      myOrders: {
        orders: [order, { ...order, _id: 'order-xyz' }],
        totalPages: 1,
        currentPage: 1,
        count: 2
      }
    }
  });

  renderWithProviders(<List history={{ push: vi.fn() }} />, {
    preloadedState: { account: { user: { role: ROLES.Member } } }
  });

  await screen.findByText('order-abc');
  const search = screen.getByPlaceholderText('Type the complete order ID');

  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  fireEvent.change(search, { target: { value: 'abc' } });
  vi.advanceTimersByTime(1000);
  vi.useRealTimers();
  await screen.findByText('1 orders');

  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  fireEvent.change(search, { target: { value: 'a' } });
  vi.advanceTimersByTime(1000);
  vi.useRealTimers();

  expect(await screen.findByText('2 orders')).toBeInTheDocument();
});

it('re-fetches the given page via Pagination, scoped to the current page', async () => {
  mock.onPost(GRAPHQL_URL).reply(200, { data: { myOrders: { orders: [order], totalPages: 2, currentPage: 1, count: 15 } } });

  renderWithProviders(<List history={{ push: vi.fn() }} />, {
    preloadedState: { account: { user: { role: ROLES.Member } } }
  });

  await screen.findByText('order-abc');
  fireEvent.click(screen.getByText('2'));

  await vi.waitFor(() => expect(mock.history.post).toHaveLength(2));
});
