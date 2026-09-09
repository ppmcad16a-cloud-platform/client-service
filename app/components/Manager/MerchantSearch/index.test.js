import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import MerchantSearch from 'app/components/Manager/MerchantSearch';

it('renders the search bar with the merchant-specific placeholder', () => {
  render(<MerchantSearch onSearch={() => {}} onBlur={() => {}} onSearchSubmit={() => {}} />);

  expect(screen.getByPlaceholderText('Type email, phone number, brand or status')).toBeInTheDocument();
});

it('wires onSearchSubmit through to the search bar submit', () => {
  const handleSubmit = vi.fn();
  const { container } = render(
    <MerchantSearch onSearch={() => {}} onBlur={() => {}} onSearchSubmit={handleSubmit} />
  );

  fireEvent.submit(container.querySelector('form'));
  expect(handleSubmit).toHaveBeenCalledWith({ name: 'merchant', value: '' });
});

it('wires onBlur through to the search bar', () => {
  const handleBlur = vi.fn();
  render(<MerchantSearch onSearch={() => {}} onBlur={handleBlur} onSearchSubmit={() => {}} />);

  fireEvent.blur(screen.getByPlaceholderText('Type email, phone number, brand or status'));
  expect(handleBlur).toHaveBeenCalledWith({ name: 'merchant', value: '' });
});
