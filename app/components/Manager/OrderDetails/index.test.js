import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import OrderDetails from 'app/components/Manager/OrderDetails';
import { ROLES } from 'app/constants';

it('composes the meta, items, and summary sections', () => {
  const order = {
    _id: 'order-1',
    created: '2024-01-01T00:00:00.000Z',
    total: 100,
    totalTax: 8,
    totalWithTax: 108,
    products: [
      {
        _id: 'item-1',
        status: 'Delivered',
        quantity: 1,
        totalPrice: 20,
        product: { slug: 'widget', name: 'Widget', price: 20 }
      }
    ]
  };

  render(
    <OrderDetails
      order={order}
      user={{ role: ROLES.Member }}
      cancelOrder={() => {}}
      updateOrderItemStatus={() => {}}
      onBack={() => {}}
    />,
    { wrapper: MemoryRouter }
  );

  expect(screen.getByText('Order Items')).toBeInTheDocument();
  expect(screen.getByText('Order Summary')).toBeInTheDocument();
  expect(screen.getByText('Widget')).toBeInTheDocument();
});
