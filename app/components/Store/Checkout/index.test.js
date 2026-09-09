import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import Checkout from 'app/components/Store/Checkout';

it('lets a logged-in user place the order directly', () => {
  const placeOrder = vi.fn();
  render(<Checkout authenticated handleShopping={() => {}} handleCheckout={() => {}} placeOrder={placeOrder} />);

  fireEvent.click(screen.getByRole('button', { name: 'Place Order' }));
  expect(placeOrder).toHaveBeenCalledTimes(1);
});

it('sends a logged-out user through the login-gated checkout flow instead', () => {
  const handleCheckout = vi.fn();
  render(
    <Checkout authenticated={false} handleShopping={() => {}} handleCheckout={handleCheckout} placeOrder={() => {}} />
  );

  expect(screen.queryByRole('button', { name: 'Place Order' })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Proceed To Checkout' }));
  expect(handleCheckout).toHaveBeenCalledTimes(1);
});

it('calls handleShopping when "Continue shopping" is clicked', () => {
  const handleShopping = vi.fn();
  render(<Checkout authenticated handleShopping={handleShopping} handleCheckout={() => {}} placeOrder={() => {}} />);

  fireEvent.click(screen.getByRole('button', { name: 'Continue shopping' }));
  expect(handleShopping).toHaveBeenCalledTimes(1);
});
