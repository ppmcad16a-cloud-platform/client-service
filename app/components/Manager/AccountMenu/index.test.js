import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import AccountMenu from 'app/components/Manager/AccountMenu';

const links = [
  { name: 'Account', to: '/dashboard' },
  { name: 'Orders', to: '/dashboard/orders', prefix: '/prefix' }
];

it('renders every link, applying a prefix when given one', () => {
  render(<AccountMenu isMenuOpen={false} links={links} toggleMenu={() => {}} />, { wrapper: MemoryRouter });

  expect(screen.getByRole('link', { name: 'Account' })).toHaveAttribute('href', '/dashboard');
  expect(screen.getByText('Orders').closest('a')).toHaveAttribute('href', '/prefix/dashboard/orders');
});

it('collapses the menu button when closed and expands it when open', () => {
  const { rerender } = render(<AccountMenu isMenuOpen={false} links={links} toggleMenu={() => {}} />, {
    wrapper: MemoryRouter
  });

  let button = screen.getByRole('button', { name: 'Dashboard Menu' });
  expect(button).toHaveClass('menu-panel', 'collapse');
  expect(button).toHaveAttribute('aria-expanded', 'false');

  rerender(<AccountMenu isMenuOpen={true} links={links} toggleMenu={() => {}} />);
  button = screen.getByRole('button', { name: 'Dashboard Menu' });
  expect(button).not.toHaveClass('collapse');
  expect(button).toHaveAttribute('aria-expanded', 'true');
});

it('calls toggleMenu when the menu button is clicked', () => {
  const handleToggle = vi.fn();
  render(<AccountMenu isMenuOpen={false} links={links} toggleMenu={handleToggle} />, { wrapper: MemoryRouter });

  fireEvent.click(screen.getByRole('button', { name: 'Dashboard Menu' }));
  expect(handleToggle).toHaveBeenCalledTimes(1);
});
