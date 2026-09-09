import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import CartList from 'app/components/Store/CartList';

const item = { _id: '1', slug: 'widget', name: 'Widget', imageUrl: '', totalPrice: 20, quantity: 2 };

it('renders each cart item with its image, name, price, and quantity', () => {
  render(<CartList cartItems={[item]} handleRemoveFromCart={() => {}} toggleCart={() => {}} />, {
    wrapper: MemoryRouter
  });

  expect(screen.getByText('Widget')).toBeInTheDocument();
  expect(screen.getByText('$20')).toBeInTheDocument();
  expect(screen.getByText('2')).toBeInTheDocument();
});

it('closes the cart when the product link is clicked', () => {
  const handleToggle = vi.fn();
  render(<CartList cartItems={[item]} handleRemoveFromCart={() => {}} toggleCart={handleToggle} />, {
    wrapper: MemoryRouter
  });

  fireEvent.click(screen.getByText('Widget'));
  expect(handleToggle).toHaveBeenCalledTimes(1);
});

it('calls handleRemoveFromCart with the item when removed', () => {
  const handleRemove = vi.fn();
  render(<CartList cartItems={[item]} handleRemoveFromCart={handleRemove} toggleCart={() => {}} />, {
    wrapper: MemoryRouter
  });

  fireEvent.click(screen.getByRole('button', { name: 'remove Widget from cart' }));
  expect(handleRemove).toHaveBeenCalledWith(item);
});
