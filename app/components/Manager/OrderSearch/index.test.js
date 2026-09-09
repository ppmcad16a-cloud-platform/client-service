import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import OrderSearch from 'app/components/Manager/OrderSearch';

it('renders the search bar with the order-specific placeholder', () => {
  render(<OrderSearch onSearch={() => {}} onBlur={() => {}} onSearchSubmit={() => {}} />);

  expect(screen.getByPlaceholderText('Type the complete order ID')).toBeInTheDocument();
});

it('wires onSearchSubmit through to the search bar submit', () => {
  const handleSubmit = vi.fn();
  const { container } = render(<OrderSearch onSearch={() => {}} onBlur={() => {}} onSearchSubmit={handleSubmit} />);

  fireEvent.submit(container.querySelector('form'));
  expect(handleSubmit).toHaveBeenCalledWith({ name: 'order', value: '' });
});

it('wires onBlur through to the search bar', () => {
  const handleBlur = vi.fn();
  render(<OrderSearch onSearch={() => {}} onBlur={handleBlur} onSearchSubmit={() => {}} />);

  fireEvent.blur(screen.getByPlaceholderText('Type the complete order ID'));
  expect(handleBlur).toHaveBeenCalledWith({ name: 'order', value: '' });
});
