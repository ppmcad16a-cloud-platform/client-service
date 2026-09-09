import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import BrandList from 'app/components/Store/BrandList';

it('renders each brand linked to its storefront page', () => {
  const brands = [{ slug: 'acme', name: 'Acme', description: 'Fine goods' }];

  render(<BrandList brands={brands} />, { wrapper: MemoryRouter });

  expect(screen.getByText('Shop By Brand')).toBeInTheDocument();
  expect(screen.getByText('Acme')).toBeInTheDocument();
  expect(screen.getByText('Fine goods')).toBeInTheDocument();
  expect(screen.getByText('Acme').closest('a')).toHaveAttribute('href', '/shop/brand/acme');
});
