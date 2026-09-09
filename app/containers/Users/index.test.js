import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import Users from 'app/containers/Users';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL, ROLES } from 'app/constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

const user = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@example.com',
  provider: 'email',
  created: '2024-01-01T00:00:00.000Z',
  role: ROLES.Member
};

it('fetches users on mount and renders them with pagination when there are multiple pages', async () => {
  mock.onGet(`${API_URL}/user`).reply(200, { users: [user], totalPages: 2, currentPage: 1, count: 15 });

  renderWithProviders(<Users />);

  expect(await screen.findByText('Jane Doe')).toBeInTheDocument();
  expect(screen.getByText('15 users')).toBeInTheDocument();
  expect(document.querySelector('.pagination')).toBeInTheDocument();
});

it('shows "No users found." when the list is empty', async () => {
  mock.onGet(`${API_URL}/user`).reply(200, { users: [], totalPages: 1, currentPage: 1, count: 0 });

  renderWithProviders(<Users />);

  expect(await screen.findByText('No users found.')).toBeInTheDocument();
});

it('searches users (2+ chars) and shows the search-scoped count without pagination', async () => {
  mock.onGet(`${API_URL}/user`).reply(200, { users: [user], totalPages: 2, currentPage: 1, count: 15 });
  mock.onGet(`${API_URL}/user/search`).reply(200, { users: [{ ...user, firstName: 'Bob' }] });

  renderWithProviders(<Users />);

  await screen.findByText('Jane Doe');

  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  fireEvent.change(screen.getByPlaceholderText('Type user name or email'), { target: { value: 'bo' } });
  vi.advanceTimersByTime(1000);
  vi.useRealTimers();

  expect(await screen.findByText('Bob Doe')).toBeInTheDocument();
  expect(screen.getByText('1 users')).toBeInTheDocument();
  expect(document.querySelector('.pagination')).not.toBeInTheDocument();
});

it('clears the search (fewer than 2 chars) and falls back to the plain users list', async () => {
  mock.onGet(`${API_URL}/user`).reply(200, { users: [user], totalPages: 1, currentPage: 1, count: 1 });
  mock.onGet(`${API_URL}/user/search`).reply(200, { users: [{ ...user, firstName: 'Bob' }] });

  renderWithProviders(<Users />);

  await screen.findByText('Jane Doe');
  const search = screen.getByPlaceholderText('Type user name or email');

  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  fireEvent.change(search, { target: { value: 'bo' } });
  vi.advanceTimersByTime(1000);
  vi.useRealTimers();
  await screen.findByText('Bob Doe');

  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  fireEvent.change(search, { target: { value: 'b' } });
  vi.advanceTimersByTime(1000);
  vi.useRealTimers();

  expect(await screen.findByText('Jane Doe')).toBeInTheDocument();
});

it('re-fetches the given page via Pagination', async () => {
  mock.onGet(`${API_URL}/user`).reply(200, { users: [user], totalPages: 2, currentPage: 1, count: 15 });

  renderWithProviders(<Users />);

  await screen.findByText('Jane Doe');
  fireEvent.click(screen.getByText('2'));

  await vi.waitFor(() => expect(mock.history.get.filter(r => r.url === `${API_URL}/user`)).toHaveLength(2));
});
