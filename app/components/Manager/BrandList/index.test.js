import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import BrandList from 'app/components/Manager/BrandList';

it("shows the merchant attribution when viewing a brand owned by someone else", () => {
  const brands = [
    { _id: '1', name: 'Acme', description: 'Fine goods', merchant: { _id: 'm1', name: 'Jane' } }
  ];

  render(<BrandList brands={brands} user={{ merchant: 'm2' }} />, { wrapper: MemoryRouter });

  expect(screen.getByText('Acme')).toBeInTheDocument();
  expect(screen.getByText('By')).toBeInTheDocument();
  expect(screen.getByText('Jane')).toBeInTheDocument();
});

it("hides the attribution when the brand has no merchant", () => {
  const brands = [{ _id: '1', name: 'Acme', description: 'Fine goods' }];

  render(<BrandList brands={brands} user={{}} />, { wrapper: MemoryRouter });

  expect(screen.queryByText('By')).not.toBeInTheDocument();
});

it("hides the attribution when viewing the user's own brand", () => {
  const brands = [
    { _id: '1', name: 'Acme', description: 'Fine goods', merchant: { _id: 'm1', name: 'Jane' } }
  ];

  render(<BrandList brands={brands} user={{ merchant: 'm1' }} />, { wrapper: MemoryRouter });

  expect(screen.queryByText('By')).not.toBeInTheDocument();
});

it('links each brand to its own edit page', () => {
  const brands = [{ _id: '1', name: 'Acme', description: 'Fine goods' }];

  render(<BrandList brands={brands} user={{}} />, { wrapper: MemoryRouter });

  expect(screen.getByText('Acme').closest('a')).toHaveAttribute('href', '/dashboard/brand/edit/1');
});
