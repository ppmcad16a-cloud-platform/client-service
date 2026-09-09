import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import OrderList from 'app/components/Manager/OrderList';

it('renders an order card with its first item, status, id, date, and total', () => {
  const orders = [
    {
      _id: 'order-1',
      created: '2024-01-01T00:00:00.000Z',
      totalWithTax: 108,
      products: [{ status: 'Processing', product: { imageUrl: '', name: 'Widget' } }]
    }
  ];

  render(<OrderList orders={orders} />, { wrapper: MemoryRouter });

  expect(screen.getByText('Processing')).toBeInTheDocument();
  expect(screen.getByText('order-1')).toBeInTheDocument();
  expect(screen.getByText('$108')).toBeInTheDocument();
  expect(screen.getByAltText('Widget').closest('a')).toHaveAttribute('href', '/order/order-1');
});

it('shows "Unavailable" status and a $0 total when the order has no products/total', () => {
  const orders = [{ _id: 'order-2', created: '2024-01-01T00:00:00.000Z', products: null }];

  render(<OrderList orders={orders} />, { wrapper: MemoryRouter });

  expect(screen.getByText('Unavailable')).toBeInTheDocument();
  expect(screen.getByText('$0')).toBeInTheDocument();
});
