import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import WishList from 'app/components/Manager/WishList';

it('renders a wishlist item with its image, name, price, and added date', () => {
  const wishlist = [
    {
      created: '2024-01-01T00:00:00.000Z',
      isLiked: true,
      product: { _id: 'p1', slug: 'widget', name: 'Widget', price: 10, imageUrl: '' }
    }
  ];

  render(<WishList wishlist={wishlist} updateWishlist={() => {}} />, { wrapper: MemoryRouter });

  expect(screen.getByText('Widget')).toBeInTheDocument();
  expect(screen.getByText('$10')).toBeInTheDocument();
  expect(screen.getByText('Widget').closest('a')).toHaveAttribute('href', '/product/widget');
});

it('calls updateWishlist with the toggled isLiked flag and product id when removed', () => {
  const handleUpdate = vi.fn();
  const wishlist = [
    {
      created: '2024-01-01T00:00:00.000Z',
      isLiked: true,
      product: { _id: 'p1', slug: 'widget', name: 'Widget', price: 10, imageUrl: '' }
    }
  ];

  render(<WishList wishlist={wishlist} updateWishlist={handleUpdate} />, { wrapper: MemoryRouter });

  fireEvent.click(screen.getByRole('button'));
  expect(handleUpdate).toHaveBeenCalledWith(false, 'p1');
});

it('renders nothing when the wishlist is empty', () => {
  const { container } = render(<WishList wishlist={[]} updateWishlist={() => {}} />, { wrapper: MemoryRouter });

  expect(container.querySelector('.w-list').children).toHaveLength(0);
});
