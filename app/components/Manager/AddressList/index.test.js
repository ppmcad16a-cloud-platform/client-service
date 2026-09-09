import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import AddressList from 'app/components/Manager/AddressList';

it('renders a default-address entry with a checkmark and a plain entry without one', () => {
  const addresses = [
    { _id: '1', address: '123 Main St', city: 'Springfield', country: 'US', zipCode: '00000', isDefault: true },
    { _id: '2', address: '456 Oak Ave', city: 'Shelbyville', country: 'US', zipCode: '11111', isDefault: false }
  ];

  render(<AddressList addresses={addresses} />, { wrapper: MemoryRouter });

  expect(screen.getByText('Default Delivery Address')).toBeInTheDocument();
  expect(screen.getByText('Delivery Address')).toBeInTheDocument();
  expect(screen.getByText('123 Main St Springfield, US, 00000')).toBeInTheDocument();
  expect(screen.getByText('123 Main St Springfield, US, 00000').closest('a')).toHaveAttribute(
    'href',
    '/dashboard/address/edit/1'
  );
});

it('renders nothing when there are no addresses', () => {
  const { container } = render(<AddressList addresses={[]} />, { wrapper: MemoryRouter });

  expect(container.querySelector('.a-list').children).toHaveLength(0);
});
