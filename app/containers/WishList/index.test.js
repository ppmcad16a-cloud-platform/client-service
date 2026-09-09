import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import WishList from 'app/containers/WishList';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL } from 'app/constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

const item = {
  created: '2024-01-01T00:00:00.000Z',
  isLiked: true,
  product: { _id: 'p1', slug: 'widget', name: 'Widget', price: 10, imageUrl: '' }
};

it('fetches the wishlist on mount and renders it', async () => {
  mock.onGet(`${API_URL}/wishlist`).reply(200, { wishlist: [item] });

  renderWithProviders(<WishList />);

  expect(await screen.findByText('Widget')).toBeInTheDocument();
});

it('shows "You have no items in your wishlist yet." when empty', async () => {
  mock.onGet(`${API_URL}/wishlist`).reply(200, { wishlist: [] });

  renderWithProviders(<WishList />);

  expect(await screen.findByText('You have no items in your wishlist yet.')).toBeInTheDocument();
});

it('removes an item from the wishlist, hitting the real wishlist endpoint', async () => {
  mock.onGet(`${API_URL}/wishlist`).reply(200, { wishlist: [item] });
  mock.onPost(`${API_URL}/wishlist`).reply(200, { success: true, message: 'Removed!' });

  renderWithProviders(<WishList />, { preloadedState: { authentication: { authenticated: true } } });

  await screen.findByText('Widget');
  fireEvent.click(screen.getByRole('button'));

  await vi.waitFor(() => expect(mock.history.post).toHaveLength(1));
  expect(JSON.parse(mock.history.post[0].data)).toEqual({ isLiked: false, product: 'p1' });
});
