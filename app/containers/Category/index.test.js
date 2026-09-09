import React from 'react';
import { screen } from '@testing-library/react';

import Category from 'app/containers/Category';
import renderWithProviders from '../../../tests/renderWithProviders';

it('renders the category list at /dashboard/category', () => {
  renderWithProviders(<Category />, { route: '/dashboard/category' });
  expect(screen.getByText('Categories')).toBeInTheDocument();
});

it('renders the edit-category page at /dashboard/category/edit/:id', () => {
  renderWithProviders(<Category />, { route: '/dashboard/category/edit/c1' });
  expect(screen.getByText('Edit Category')).toBeInTheDocument();
});

it('renders the add-category form at /dashboard/category/add', () => {
  renderWithProviders(<Category />, { route: '/dashboard/category/add' });
  expect(screen.getByRole('heading', { name: 'Add Category' })).toBeInTheDocument();
});

it('renders Page404 for an unmatched sub-route', () => {
  renderWithProviders(<Category />, { route: '/dashboard/category/does-not-exist' });
  expect(screen.getByText('The page you are looking for was not found.')).toBeInTheDocument();
});
