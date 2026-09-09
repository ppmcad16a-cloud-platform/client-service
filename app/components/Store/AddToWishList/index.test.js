import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import AddToWishList from 'app/components/Store/AddToWishList';

it('reflects the liked state and reports toggles with the product id', () => {
  const handleUpdate = vi.fn();
  render(<AddToWishList id='p1' liked={false} enabled updateWishlist={handleUpdate} />);

  const checkbox = screen.getByRole('checkbox');
  expect(checkbox).not.toBeChecked();

  fireEvent.click(checkbox);
  expect(handleUpdate).toHaveBeenCalledWith(true, 'p1');
});

it('renders checked when already liked', () => {
  render(<AddToWishList id='p1' liked={true} enabled updateWishlist={() => {}} />);

  expect(screen.getByRole('checkbox')).toBeChecked();
});

it('forces the checkbox unchecked when not enabled (e.g. logged out) — note: Checkbox only forces `checked` false for `disabled`, it does not set the native disabled attribute', () => {
  render(<AddToWishList id='p1' liked={true} enabled={false} updateWishlist={() => {}} />);

  expect(screen.getByRole('checkbox')).not.toBeChecked();
});
