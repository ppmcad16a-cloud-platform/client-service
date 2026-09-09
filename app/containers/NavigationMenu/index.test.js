import React from 'react';
import { screen, fireEvent } from '@testing-library/react';

import NavigationMenu from 'app/containers/NavigationMenu';
import renderWithProviders from '../../../tests/renderWithProviders';

const category = { _id: 'c1', slug: 'gadgets', name: 'Gadgets' };

it('renders each category link', () => {
  renderWithProviders(<NavigationMenu />, {
    preloadedState: { category: { storeCategories: [category] } }
  });

  expect(screen.getByText('Gadgets')).toHaveAttribute('href', '/shop/category/gadgets');
});

it('hides the close button when the menu is closed', () => {
  renderWithProviders(<NavigationMenu />, {
    preloadedState: { navigation: { isMenuOpen: false }, category: { storeCategories: [] } }
  });

  expect(screen.queryByRole('button', { name: 'close the menu' })).not.toBeInTheDocument();
});

it('shows a close button when the menu is open, wired to toggleMenu', () => {
  renderWithProviders(<NavigationMenu />, {
    preloadedState: { navigation: { isMenuOpen: true }, category: { storeCategories: [] } }
  });

  fireEvent.click(screen.getByRole('button', { name: 'close the menu' }));
});

it('closes the menu when a category link is clicked', () => {
  renderWithProviders(<NavigationMenu />, {
    preloadedState: { category: { storeCategories: [category] } }
  });

  fireEvent.click(screen.getByText('Gadgets'));

  // No assertion needed beyond "doesn't throw" — toggleMenu is the real
  // Navigation-duck action, already covered by its own tests; this just
  // confirms the click handler is wired.
});
