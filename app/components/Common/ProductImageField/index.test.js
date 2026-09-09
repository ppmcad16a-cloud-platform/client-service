import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import ProductImageField from 'app/components/Common/ProductImageField';

it('renders the image URL input and a live preview, and reports changes', () => {
  const handleChange = vi.fn();

  render(<ProductImageField value='http://example.com/photo.png' error={null} onInputChange={handleChange} />);

  const input = screen.getByPlaceholderText('https://example.com/product-photo.jpg');
  expect(input).toHaveValue('http://example.com/photo.png');
  expect(screen.getByAltText('Product image preview')).toHaveAttribute('src', 'http://example.com/photo.png');

  fireEvent.change(input, { target: { value: 'http://example.com/new.png' } });
  expect(handleChange).toHaveBeenCalledWith('imageUrl', 'http://example.com/new.png');
});

it('shows the validation error message when given one', () => {
  render(<ProductImageField value='' error={['Image URL is required.']} onInputChange={() => {}} />);

  expect(screen.getByText('Image URL is required.')).toBeInTheDocument();
});
