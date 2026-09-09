import React from 'react';
import { screen } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import Product from 'app/containers/Product';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL } from 'app/constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

it('renders the product list at /dashboard/product', async () => {
  mock.onGet(`${API_URL}/product`).reply(200, { products: [] });

  renderWithProviders(<Product />, { route: '/dashboard/product' });

  expect(await screen.findByText('No products found.')).toBeInTheDocument();
});

it('renders the add-product form at /dashboard/product/add', () => {
  mock.onGet(`${API_URL}/brand/list/select`).reply(200, { brands: [] });

  renderWithProviders(<Product />, { route: '/dashboard/product/add' });

  expect(screen.getByRole('heading', { name: 'Add Product' })).toBeInTheDocument();
});

it('renders the edit-product page at /dashboard/product/edit/:id', async () => {
  mock.onGet(`${API_URL}/product/p1`).reply(404);
  mock.onGet(`${API_URL}/brand/list/select`).reply(200, { brands: [] });

  renderWithProviders(<Product />, { route: '/dashboard/product/edit/p1' });

  expect(await screen.findByText('No product found.')).toBeInTheDocument();
});

it('renders Page404 for an unmatched sub-route', () => {
  renderWithProviders(<Product />, { route: '/dashboard/product/does-not-exist' });

  expect(screen.getByText('The page you are looking for was not found.')).toBeInTheDocument();
});
