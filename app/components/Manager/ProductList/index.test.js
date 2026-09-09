import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import ProductList from 'app/components/Manager/ProductList';

it('renders each product linked to its own edit page', () => {
  const products = [{ _id: '1', name: 'Widget', description: 'A fine widget', imageUrl: '' }];

  render(<ProductList products={products} />, { wrapper: MemoryRouter });

  expect(screen.getByText('Widget')).toBeInTheDocument();
  expect(screen.getByText('A fine widget')).toBeInTheDocument();
  expect(screen.getByText('Widget').closest('a')).toHaveAttribute('href', '/dashboard/product/edit/1');
});

it('renders nothing when there are no products', () => {
  const { container } = render(<ProductList products={[]} />, { wrapper: MemoryRouter });

  expect(container.querySelector('.p-list').children).toHaveLength(0);
});
