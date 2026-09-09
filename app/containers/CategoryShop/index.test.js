import React from 'react';
import { screen } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import CategoryShop from 'app/containers/CategoryShop';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL } from 'app/constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

const advancedFilters = {
  name: '', category: 'all', brand: 'all', min: 0, max: 5000, rating: 0, order: 0, currentPage: 1, limit: 20
};

it('filters by the category slug on mount and renders matching products', async () => {
  mock.onGet(`${API_URL}/product/list`).reply(200, {
    products: [{ _id: '1', slug: 'widget', name: 'Widget', description: 'A fine widget', price: 10 }],
    totalPages: 1,
    currentPage: 1,
    count: 1
  });

  renderWithProviders(<CategoryShop match={{ params: { slug: 'gadgets' } }} />, {
    preloadedState: { product: { advancedFilters } }
  });

  expect(await screen.findByText('Widget')).toBeInTheDocument();
});

it('re-filters when the category slug changes', async () => {
  mock.onGet(`${API_URL}/product/list`).reply(200, { products: [], totalPages: 1, currentPage: 1, count: 0 });

  const { rerender } = renderWithProviders(<CategoryShop match={{ params: { slug: 'gadgets' } }} />, {
    preloadedState: { product: { advancedFilters } }
  });

  await screen.findByText('No products found.');

  mock.onGet(`${API_URL}/product/list`).reply(200, {
    products: [{ _id: '2', slug: 'gizmo', name: 'Gizmo', description: 'A fine gizmo', price: 15 }],
    totalPages: 1,
    currentPage: 1,
    count: 1
  });

  rerender(<CategoryShop match={{ params: { slug: 'gizmos' } }} />);

  expect(await screen.findByText('Gizmo')).toBeInTheDocument();
});

it('shows a "no products" message when the filtered list is empty', async () => {
  mock.onGet(`${API_URL}/product/list`).reply(200, { products: [], totalPages: 1, currentPage: 1, count: 0 });

  renderWithProviders(<CategoryShop match={{ params: { slug: 'gadgets' } }} />, {
    preloadedState: { product: { advancedFilters } }
  });

  expect(await screen.findByText('No products found.')).toBeInTheDocument();
});
