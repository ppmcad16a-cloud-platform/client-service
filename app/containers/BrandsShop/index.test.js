import React from 'react';
import { screen } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import BrandsShop from 'app/containers/BrandsShop';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL } from 'app/constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

// Deliberately not overriding state.product in preloadedState — Redux's
// combineReducers only falls back to a slice reducer's own default initial
// state when that slice is entirely absent from preloadedState; supplying a
// partial `product: { advancedFilters }` here replaces the whole slice and
// leaves `storeProducts` (etc.) undefined, crashing BrandsShop's unguarded
// `products.length` check on the very first render.
it('filters by the brand slug on mount and renders matching products', async () => {
  mock.onGet(`${API_URL}/product/list`).reply(200, {
    products: [{ _id: '1', slug: 'widget', name: 'Widget', description: 'A fine widget', price: 10 }],
    totalPages: 1,
    currentPage: 1,
    count: 1
  });

  renderWithProviders(<BrandsShop match={{ params: { slug: 'acme' } }} />);

  expect(await screen.findByText('Widget')).toBeInTheDocument();
});

it('re-filters when the brand slug changes', async () => {
  mock.onGet(`${API_URL}/product/list`).reply(200, { products: [], totalPages: 1, currentPage: 1, count: 0 });

  const { rerender } = renderWithProviders(<BrandsShop match={{ params: { slug: 'acme' } }} />);

  await screen.findByText('No products found.');

  mock.onGet(`${API_URL}/product/list`).reply(200, {
    products: [{ _id: '2', slug: 'gadget', name: 'Gadget', description: 'A fine gadget', price: 15 }],
    totalPages: 1,
    currentPage: 1,
    count: 1
  });

  rerender(<BrandsShop match={{ params: { slug: 'globex' } }} />);

  expect(await screen.findByText('Gadget')).toBeInTheDocument();
});

it('shows a "no products" message when the filtered list is empty', async () => {
  mock.onGet(`${API_URL}/product/list`).reply(200, { products: [], totalPages: 1, currentPage: 1, count: 0 });

  renderWithProviders(<BrandsShop match={{ params: { slug: 'acme' } }} />);

  expect(await screen.findByText('No products found.')).toBeInTheDocument();
});
