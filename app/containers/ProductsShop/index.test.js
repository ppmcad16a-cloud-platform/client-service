import React from 'react';
import { screen } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import ProductsShop from 'app/containers/ProductsShop';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL } from 'app/constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

it('fetches all products (no slug) on mount and renders them', async () => {
  mock.onGet(`${API_URL}/product/list`).reply(200, {
    products: [{ _id: '1', slug: 'widget', name: 'Widget', description: 'A fine widget', price: 10 }],
    totalPages: 1,
    currentPage: 1,
    count: 1
  });

  renderWithProviders(<ProductsShop match={{ params: {} }} />);

  expect(await screen.findByText('Widget')).toBeInTheDocument();
});

it('shows a "no products" message when the list is empty', async () => {
  mock.onGet(`${API_URL}/product/list`).reply(200, { products: [], totalPages: 1, currentPage: 1, count: 0 });

  renderWithProviders(<ProductsShop match={{ params: {} }} />);

  expect(await screen.findByText('No products found.')).toBeInTheDocument();
});
