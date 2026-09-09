import React from 'react';
import { screen } from '@testing-library/react';

import Address from 'app/containers/Address';
import renderWithProviders from '../../../tests/renderWithProviders';

it('renders the addresses list at /dashboard/address', () => {
  renderWithProviders(<Address />, { route: '/dashboard/address' });
  expect(screen.getByText('Addresses')).toBeInTheDocument();
});

it('renders the add-address form at /dashboard/address/add', () => {
  renderWithProviders(<Address />, { route: '/dashboard/address/add' });
  expect(screen.getByRole('heading', { name: 'Add Address' })).toBeInTheDocument();
});

it('renders the edit-address form at /dashboard/address/edit/:id', () => {
  renderWithProviders(<Address />, { route: '/dashboard/address/edit/addr-1' });
  expect(screen.getByText('Edit Address')).toBeInTheDocument();
});

it('renders Page404 for an unmatched sub-route', () => {
  renderWithProviders(<Address />, { route: '/dashboard/address/does-not-exist' });
  expect(screen.getByText('The page you are looking for was not found.')).toBeInTheDocument();
});
