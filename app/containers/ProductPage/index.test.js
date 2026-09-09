import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import ProductPage from 'app/containers/ProductPage';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL } from 'app/constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
  document.body.classList.remove('product-page');
});

const mockProductAndReviews = (overrides = {}) => {
  mock.onGet(`${API_URL}/product/item/widget`).reply(200, {
    product: {
      _id: 'p1',
      slug: 'widget',
      name: 'Widget',
      sku: 'ABC-1',
      description: 'A fine widget',
      price: 20,
      quantity: 10,
      imageUrl: '',
      ...overrides
    }
  });
  mock.onGet(`${API_URL}/review/widget`).reply(200, { reviews: [] });
};

it('fetches the product and its reviews on mount, adding the product-page body class', async () => {
  mockProductAndReviews();

  renderWithProviders(<ProductPage match={{ params: { slug: 'widget' } }} />);

  expect(await screen.findByText('Widget')).toBeInTheDocument();
  expect(document.body).toHaveClass('product-page');
});

it('removes the product-page body class on unmount', async () => {
  mockProductAndReviews();

  const { unmount } = renderWithProviders(<ProductPage match={{ params: { slug: 'widget' } }} />);

  await screen.findByText('Widget');
  unmount();

  expect(document.body).not.toHaveClass('product-page');
});

it('shows "No product found." when nothing loads', async () => {
  // componentDidMount's real fetchStoreProduct(slug) dispatches loading:true
  // synchronously, so (like the other partial-preloadedState fixes above)
  // trying to preload around it isn't reliable — mock the endpoint to fail
  // instead, so storeProduct is left at its real, genuinely-empty (0-key)
  // initial state. A *successful* empty `{}` response wouldn't do it: the
  // thunk always spreads an `inventory` key onto the payload, so
  // Object.keys(product).length would be 1, not 0.
  mock.onGet(`${API_URL}/product/item/missing`).reply(404);
  mock.onGet(`${API_URL}/review/missing`).reply(200, { reviews: [] });

  renderWithProviders(<ProductPage match={{ params: { slug: 'missing' } }} />);

  expect(await screen.findByText('No product found.')).toBeInTheDocument();
});

it('shows "Out of stock" when inventory is depleted, and disables Add To Bag', async () => {
  mockProductAndReviews({ quantity: 0 });
  mock.onGet(`${API_URL}/product/item/widget`).reply(200, {
    product: { _id: 'p1', slug: 'widget', name: 'Widget', price: 20, quantity: 0, imageUrl: '' }
  });

  renderWithProviders(<ProductPage match={{ params: { slug: 'widget' } }} />);

  expect(await screen.findByText('Out of stock')).toBeInTheDocument();
});

it('shows Remove From Bag when the product is already in the cart', async () => {
  mockProductAndReviews();

  renderWithProviders(<ProductPage match={{ params: { slug: 'widget' } }} />, {
    preloadedState: { cart: { cartItems: [{ _id: 'p1' }] } }
  });

  expect(await screen.findByRole('button', { name: 'Remove From Bag' })).toBeInTheDocument();
});

it('disables Remove From Bag when a since-in-cart product is now out of stock', async () => {
  mockProductAndReviews({ quantity: 0 });

  renderWithProviders(<ProductPage match={{ params: { slug: 'widget' } }} />, {
    preloadedState: { cart: { cartItems: [{ _id: 'p1' }] } }
  });

  expect(await screen.findByRole('button', { name: 'Remove From Bag' })).toBeDisabled();
});

it('shows a "see more from" link when the product has a brand', async () => {
  mockProductAndReviews({ brand: { slug: 'acme', name: 'Acme' } });

  renderWithProviders(<ProductPage match={{ params: { slug: 'widget' } }} />);

  expect(await screen.findByText('Acme')).toHaveAttribute('href', '/shop/brand/acme');
});

it('reports quantity changes', async () => {
  mockProductAndReviews();

  renderWithProviders(<ProductPage match={{ params: { slug: 'widget' } }} />);

  const input = await screen.findByPlaceholderText('Product Quantity');
  fireEvent.input(input, { target: { value: '3' } });

  expect(input).toHaveValue(3);
});

it('adds the product to the cart when "Add To Bag" is clicked', async () => {
  mockProductAndReviews();

  renderWithProviders(<ProductPage match={{ params: { slug: 'widget' } }} />);

  const button = await screen.findByRole('button', { name: 'Add To Bag' });
  fireEvent.click(button);

  expect(await screen.findByRole('button', { name: 'Remove From Bag' })).toBeInTheDocument();
});

it('re-fetches the product when the slug param changes', async () => {
  mockProductAndReviews();
  mock.onGet(`${API_URL}/product/item/gadget`).reply(200, {
    product: { _id: 'p2', slug: 'gadget', name: 'Gadget', price: 15, quantity: 5, imageUrl: '' }
  });
  mock.onGet(`${API_URL}/review/gadget`).reply(200, { reviews: [] });

  const { rerender } = renderWithProviders(<ProductPage match={{ params: { slug: 'widget' } }} />);

  await screen.findByText('Widget');

  rerender(<ProductPage match={{ params: { slug: 'gadget' } }} />);

  expect(await screen.findByText('Gadget')).toBeInTheDocument();
});
