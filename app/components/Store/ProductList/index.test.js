import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import ProductList from 'app/components/Store/ProductList';

const baseProduct = {
  _id: 'p1',
  slug: 'widget',
  name: 'Widget',
  description: 'A fine widget',
  imageUrl: '',
  price: 20
};

it('renders a product card linked to its own page', () => {
  render(<ProductList products={[baseProduct]} updateWishlist={() => {}} authenticated={false} />, {
    wrapper: MemoryRouter
  });

  expect(screen.getByText('Widget')).toBeInTheDocument();
  expect(screen.getByText('A fine widget')).toBeInTheDocument();
  expect(screen.getByText('$20')).toBeInTheDocument();
  expect(document.querySelector('.item-link a')).toHaveAttribute('href', '/product/widget');
});

it("shows the brand attribution when the product has one", () => {
  const product = { ...baseProduct, brand: { name: 'Acme' } };
  render(<ProductList products={[product]} updateWishlist={() => {}} authenticated={false} />, {
    wrapper: MemoryRouter
  });

  expect(screen.getByText('Acme')).toBeInTheDocument();
});

it('hides the brand attribution when the product has no brand (empty object)', () => {
  const product = { ...baseProduct, brand: {} };
  render(<ProductList products={[product]} updateWishlist={() => {}} authenticated={false} />, {
    wrapper: MemoryRouter
  });

  expect(screen.queryByText('By')).not.toBeInTheDocument();
});

it('shows the average rating when the product has reviews', () => {
  const product = { ...baseProduct, totalReviews: 5, averageRating: 4.2 };
  render(<ProductList products={[product]} updateWishlist={() => {}} authenticated={false} />, {
    wrapper: MemoryRouter
  });

  expect(screen.getByText('4.2')).toBeInTheDocument();
});

it('hides the rating block when the product has no reviews', () => {
  const product = { ...baseProduct, totalReviews: 0 };
  render(<ProductList products={[product]} updateWishlist={() => {}} authenticated={false} />, {
    wrapper: MemoryRouter
  });

  expect(document.querySelector('.fa-star')).not.toBeInTheDocument();
});

it('defaults isLiked to false when unset, without crashing', () => {
  render(<ProductList products={[baseProduct]} updateWishlist={() => {}} authenticated={false} />, {
    wrapper: MemoryRouter
  });

  expect(screen.getByRole('checkbox')).not.toBeChecked();
});
