import React from 'react';
import { screen, fireEvent } from '@testing-library/react';

import Cart from 'app/containers/Cart';
import renderWithProviders from '../../../tests/renderWithProviders';
import { CART_ITEMS } from 'app/constants';

const item = { _id: '1', slug: 'widget', name: 'Widget', imageUrl: '', totalPrice: 20, quantity: 2 };

afterEach(() => {
  localStorage.clear();
});

it('shows the empty-cart message when there are no items', () => {
  renderWithProviders(<Cart />, { preloadedState: { cart: { cartItems: [], cartTotal: 0 } } });

  expect(screen.getByText('Your shopping cart is empty')).toBeInTheDocument();
});

it('renders the cart list, summary, and checkout actions when there are items', () => {
  renderWithProviders(<Cart />, {
    preloadedState: { cart: { cartItems: [item], cartTotal: 20 }, authentication: { authenticated: false } }
  });

  expect(screen.getByText('Widget')).toBeInTheDocument();
  expect(document.querySelector('.value.price')).toHaveTextContent('$20');
  expect(screen.getByRole('button', { name: 'Proceed To Checkout' })).toBeInTheDocument();
});

it('hides the close button when the cart is closed', () => {
  renderWithProviders(<Cart />, {
    preloadedState: { navigation: { isCartOpen: false }, cart: { cartItems: [], cartTotal: 0 } }
  });

  expect(screen.queryByRole('button', { name: 'close the cart' })).not.toBeInTheDocument();
});

it('shows a close button when the cart is open, wired to toggleCart', () => {
  renderWithProviders(<Cart />, {
    preloadedState: { navigation: { isCartOpen: true }, cart: { cartItems: [], cartTotal: 0 } }
  });

  const closeButton = screen.getByRole('button', { name: 'close the cart' });
  fireEvent.click(closeButton);

  expect(screen.queryByRole('button', { name: 'close the cart' })).not.toBeInTheDocument();
});

it('removes an item from the real store when its remove button is clicked', () => {
  localStorage.setItem(CART_ITEMS, JSON.stringify([item]));

  renderWithProviders(<Cart />, {
    preloadedState: { cart: { cartItems: [item], cartTotal: 20 }, authentication: { authenticated: false } }
  });

  fireEvent.click(screen.getByRole('button', { name: 'remove Widget from cart' }));

  expect(screen.getByText('Your shopping cart is empty')).toBeInTheDocument();
});

it('shows "Place Order" instead of the login-gated checkout when authenticated', () => {
  renderWithProviders(<Cart />, {
    preloadedState: { cart: { cartItems: [item], cartTotal: 20 }, authentication: { authenticated: true } }
  });

  expect(screen.getByRole('button', { name: 'Place Order' })).toBeInTheDocument();
});
