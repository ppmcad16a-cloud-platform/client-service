import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import ProductImage, { DEFAULT_PRODUCT_IMAGE } from 'app/components/Common/ProductImage';

it('renders the given src with the given alt text', () => {
  render(<ProductImage src='http://example.com/photo.png' alt='A widget' className='item-image' />);

  const img = screen.getByAltText('A widget');
  expect(img).toHaveAttribute('src', 'http://example.com/photo.png');
  expect(img).toHaveClass('item-image');
});

it('falls back to the placeholder image when src is empty', () => {
  render(<ProductImage />);

  expect(screen.getByRole('img')).toHaveAttribute('src', DEFAULT_PRODUCT_IMAGE);
});

it('swaps to the placeholder and disarms further error handling when the image fails to load', () => {
  render(<ProductImage src='http://example.com/broken.png' alt='Broken' />);

  const img = screen.getByAltText('Broken');
  fireEvent.error(img);

  expect(img).toHaveAttribute('src', DEFAULT_PRODUCT_IMAGE);
  expect(img.onerror).toBeNull();
});
