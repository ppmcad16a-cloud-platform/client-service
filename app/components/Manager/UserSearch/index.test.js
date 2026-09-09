import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import UserSearch from 'app/components/Manager/UserSearch';

it('renders the search bar with the user-specific placeholder', () => {
  render(<UserSearch onSearch={() => {}} onBlur={() => {}} onSearchSubmit={() => {}} />);

  expect(screen.getByPlaceholderText('Type user name or email')).toBeInTheDocument();
});

it('wires onSearchSubmit through to the search bar submit', () => {
  const handleSubmit = vi.fn();
  const { container } = render(<UserSearch onSearch={() => {}} onBlur={() => {}} onSearchSubmit={handleSubmit} />);

  fireEvent.submit(container.querySelector('form'));
  expect(handleSubmit).toHaveBeenCalledWith({ name: 'user', value: '' });
});

it('wires onBlur through to the search bar', () => {
  const handleBlur = vi.fn();
  render(<UserSearch onSearch={() => {}} onBlur={handleBlur} onSearchSubmit={() => {}} />);

  fireEvent.blur(screen.getByPlaceholderText('Type user name or email'));
  expect(handleBlur).toHaveBeenCalledWith({ name: 'user', value: '' });
});
