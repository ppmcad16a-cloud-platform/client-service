import React from 'react';
import { screen } from '@testing-library/react';

import Brand from 'app/containers/Brand';
import renderWithProviders from '../../../tests/renderWithProviders';
import { ROLES } from 'app/constants';

it('renders the brand list at /dashboard/brand', () => {
  renderWithProviders(<Brand />, {
    route: '/dashboard/brand',
    preloadedState: { account: { user: { role: ROLES.Admin } } }
  });

  expect(screen.getByText('Brands')).toBeInTheDocument();
});

it('renders the edit-brand page at /dashboard/brand/edit/:id', () => {
  renderWithProviders(<Brand />, {
    route: '/dashboard/brand/edit/b1',
    preloadedState: { account: { user: { role: ROLES.Admin } } }
  });

  expect(screen.getByText('Edit Brand')).toBeInTheDocument();
});

it('renders the add-brand form at /dashboard/brand/add for an admin', () => {
  renderWithProviders(<Brand />, {
    route: '/dashboard/brand/add',
    preloadedState: { account: { user: { role: ROLES.Admin } } }
  });

  expect(screen.getByRole('heading', { name: 'Add Brand' })).toBeInTheDocument();
});

it('renders Page404 at /dashboard/brand/add for a non-admin (route is gated out)', () => {
  renderWithProviders(<Brand />, {
    route: '/dashboard/brand/add',
    preloadedState: { account: { user: { role: ROLES.Merchant } } }
  });

  expect(screen.getByText('The page you are looking for was not found.')).toBeInTheDocument();
});
