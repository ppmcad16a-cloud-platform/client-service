import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import CartIcon from 'app/components/Common/CartIcon';

it('renders with no badge and an "empty" aria-label when the cart has no items', () => {
  render(<CartIcon cartItems={[]} onClick={() => {}} />);

  const button = screen.getByRole('button', { name: 'your cart is empty' });
  expect(button).toBeInTheDocument();
  expect(button.querySelector('.cart-badge')).not.toBeInTheDocument();
});

it('shows the item count badge and a count-aware aria-label when items are present', () => {
  render(<CartIcon cartItems={[{ _id: '1' }, { _id: '2' }]} onClick={() => {}} />);

  const button = screen.getByRole('button', { name: 'your cart have 2 items' });
  expect(button.querySelector('.cart-badge')).toHaveTextContent('2');
});

it('caps the displayed badge count at "99+"', () => {
  const cartItems = Array.from({ length: 150 }, (_, i) => ({ _id: String(i) }));
  render(<CartIcon cartItems={cartItems} onClick={() => {}} />);

  expect(screen.getByText('99+')).toBeInTheDocument();
});

it('fires onClick when clicked', () => {
  const handleClick = vi.fn();
  render(<CartIcon cartItems={[]} onClick={handleClick} />);

  fireEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
