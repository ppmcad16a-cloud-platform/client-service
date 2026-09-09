import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import Shop from 'app/containers/Shop';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL } from 'app/constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
  document.body.classList.remove('shop-page');
});

// Deliberately not overriding state.product in preloadedState — a partial
// slice there would replace the whole reducer default (dropping fields like
// storeProducts) and crash Shop's unguarded `products.length` on first
// render (same gotcha hit in BrandsShop/ProductPage earlier). The default
// initial state already matches what these tests need; anything specific
// (counts, totalPages) comes from the real mocked fetch response instead.

it('adds the shop-page body class on mount and removes it on unmount', () => {
  mock.onGet(`${API_URL}/product/list`).reply(200, { products: [], totalPages: 1, currentPage: 1, count: 0 });

  const { unmount } = renderWithProviders(<Shop />, { route: '/shop' });

  expect(document.body).toHaveClass('shop-page');
  unmount();
  expect(document.body).not.toHaveClass('shop-page');
});

it('renders the storefront product grid at /shop', async () => {
  mock.onGet(`${API_URL}/product/list`).reply(200, {
    products: [{ _id: '1', slug: 'widget', name: 'Widget', description: 'A fine widget', price: 10 }],
    totalPages: 1,
    currentPage: 1,
    count: 1
  });

  renderWithProviders(<Shop />, { route: '/shop' });

  expect(await screen.findByText('Widget')).toBeInTheDocument();
  expect(await screen.findByText('1-1 products of 1 products')).toBeInTheDocument();
});

it('shows "0 products" when the shop is empty', () => {
  renderWithProviders(<Shop />, { route: '/shop' });

  expect(screen.getByText('0 products')).toBeInTheDocument();
});

it('renders the category-filtered view at /shop/category/:slug', async () => {
  mock.onGet(`${API_URL}/product/list`).reply(200, { products: [], totalPages: 1, currentPage: 1, count: 0 });

  renderWithProviders(<Shop />, { route: '/shop/category/gadgets' });

  expect(await screen.findByText('No products found.')).toBeInTheDocument();
});

it('renders the brand-filtered view at /shop/brand/:slug', async () => {
  mock.onGet(`${API_URL}/product/list`).reply(200, { products: [], totalPages: 1, currentPage: 1, count: 0 });

  renderWithProviders(<Shop />, { route: '/shop/brand/acme' });

  expect(await screen.findByText('No products found.')).toBeInTheDocument();
});

it('renders Page404 for an unmatched sub-route', () => {
  renderWithProviders(<Shop />, { route: '/shop/does-not-exist' });

  expect(screen.getByText('The page you are looking for was not found.')).toBeInTheDocument();
});

it('shows pagination and re-filters by page when there are multiple pages', async () => {
  mock.onGet(`${API_URL}/product/list`).reply(200, { products: [], totalPages: 2, currentPage: 1, count: 0 });

  renderWithProviders(<Shop />, { route: '/shop' });

  await vi.waitFor(() => expect(document.querySelector('.pagination')).toBeInTheDocument());
  // Not screen.getByText('2') — ProductFilter's rating-slider marks also
  // render a "2" label (for the 2-star mark), which would be ambiguous.
  fireEvent.click(document.querySelector('.pagination a[aria-label="Page 2"]'));

  await vi.waitFor(() => expect(mock.history.get.filter(r => r.url === `${API_URL}/product/list`)).toHaveLength(2));
});

it('reports a sort-order change via the Sort by select', async () => {
  mock.onGet(`${API_URL}/product/list`).reply(200, { products: [], totalPages: 1, currentPage: 1, count: 0 });

  const { container } = renderWithProviders(<Shop />, { route: '/shop' });

  await screen.findByText('No products found.');

  fireEvent.mouseDown(container.querySelector('.react-select__control'), { button: 0 });
  fireEvent.click(screen.getByText('Price High to Low'));

  await vi.waitFor(() => expect(mock.history.get.filter(r => r.url === `${API_URL}/product/list`)).toHaveLength(2));
});
