import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import CategoryList from 'app/components/Manager/CategoryList';

it('renders each category linked to its own edit page', () => {
  const categories = [{ _id: '1', name: 'Gadgets', description: 'Tech stuff' }];

  render(<CategoryList categories={categories} />, { wrapper: MemoryRouter });

  expect(screen.getByText('Gadgets')).toBeInTheDocument();
  expect(screen.getByText('Tech stuff')).toBeInTheDocument();
  expect(screen.getByText('Gadgets').closest('a')).toHaveAttribute('href', '/dashboard/category/edit/1');
});

it('renders nothing when there are no categories', () => {
  const { container } = render(<CategoryList categories={[]} />, { wrapper: MemoryRouter });

  expect(container.querySelector('.c-list').children).toHaveLength(0);
});
