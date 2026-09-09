import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import MiniBrand from 'app/components/Store/MiniBrand';

const brands = [{ slug: 'acme', name: 'Acme' }];

it('renders each brand link and a "See all" link to /brands', () => {
  render(<MiniBrand brands={brands} toggleBrand={() => {}} />, { wrapper: MemoryRouter });

  expect(screen.getByText('Acme')).toHaveAttribute('href', '/shop/brand/acme');
  expect(screen.getByText('See all')).toHaveAttribute('href', '/brands');
});

it('closes the brand menu when "See all" is clicked', () => {
  const handleToggle = vi.fn();
  render(<MiniBrand brands={brands} toggleBrand={handleToggle} />, { wrapper: MemoryRouter });

  fireEvent.click(screen.getByText('See all'));
  expect(handleToggle).toHaveBeenCalledTimes(1);
});

it('closes the brand menu when a brand link is clicked', () => {
  const handleToggle = vi.fn();
  render(<MiniBrand brands={brands} toggleBrand={handleToggle} />, { wrapper: MemoryRouter });

  fireEvent.click(screen.getByText('Acme'));
  expect(handleToggle).toHaveBeenCalledTimes(1);
});
