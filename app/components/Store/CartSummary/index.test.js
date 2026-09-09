import React from 'react';
import { render, screen } from '@testing-library/react';

import CartSummary from 'app/components/Store/CartSummary';

it('shows free shipping and the untaxed cart total', () => {
  render(<CartSummary cartTotal={49.99} />);

  expect(screen.getByText('Free')).toBeInTheDocument();
  expect(screen.getByText('$49.99')).toBeInTheDocument();
});
