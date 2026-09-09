import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import OrderMeta from 'app/components/Manager/OrderMeta';

it('shows the order id/date and a Cancel Order action when no item has been delivered', () => {
  const order = { _id: 'order-1', created: '2024-01-01T00:00:00.000Z', products: [{ status: 'Processing' }] };
  const handleCancel = vi.fn();
  render(<OrderMeta order={order} cancelOrder={handleCancel} onBack={() => {}} />);

  expect(screen.getByText('order-1')).toBeInTheDocument();
  const cancelButton = screen.getByRole('button', { name: 'Cancel Order' });
  fireEvent.click(cancelButton);
  expect(handleCancel).toHaveBeenCalledTimes(1);
});

it('hides Cancel Order once at least one item has been delivered', () => {
  const order = { _id: 'order-1', created: '2024-01-01T00:00:00.000Z', products: [{ status: 'Delivered' }] };
  render(<OrderMeta order={order} cancelOrder={() => {}} onBack={() => {}} />);

  expect(screen.queryByRole('button', { name: 'Cancel Order' })).not.toBeInTheDocument();
});

it('calls onBack when "Back to orders" is clicked', () => {
  const order = { _id: 'order-1', created: '2024-01-01T00:00:00.000Z', products: [] };
  const handleBack = vi.fn();
  render(<OrderMeta order={order} cancelOrder={() => {}} onBack={handleBack} />);

  fireEvent.click(screen.getByRole('button', { name: 'Back to orders' }));
  expect(handleBack).toHaveBeenCalledTimes(1);
});
