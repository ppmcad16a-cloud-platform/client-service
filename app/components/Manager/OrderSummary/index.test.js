import React from 'react';
import { render, screen } from '@testing-library/react';

import OrderSummary from 'app/components/Manager/OrderSummary';

it('renders the subtotal, tax, free shipping, and total', () => {
  const order = { total: 100, totalTax: 8, totalWithTax: 108 };
  render(<OrderSummary order={order} />);

  expect(screen.getByText('$100')).toBeInTheDocument();
  expect(screen.getByText('$8')).toBeInTheDocument();
  expect(screen.getByText('$0')).toBeInTheDocument();
  expect(screen.getByText('$108')).toBeInTheDocument();
});
