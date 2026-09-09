import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import Navigation from 'app/containers/Navigation';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL } from 'app/constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

const brand = { _id: 'b1', slug: 'acme', name: 'Acme' };
const category = { _id: 'c1', slug: 'gadgets', name: 'Gadgets' };

it('fetches store brands and categories on mount and renders their dropdowns', async () => {
  mock.onGet(`${API_URL}/brand/list`).reply(200, { brands: [brand] });
  mock.onGet(`${API_URL}/category/list`).reply(200, { categories: [category] });

  renderWithProviders(<Navigation />, {
    preloadedState: { authentication: { authenticated: false } }
  });

  expect(await screen.findByText('Brands')).toBeInTheDocument();
  expect(screen.getByText('Shop By Category')).toBeInTheDocument();
});

it('shows a login/signup dropdown when logged out', () => {
  renderWithProviders(<Navigation />, {
    preloadedState: { authentication: { authenticated: false } }
  });

  expect(screen.getByText('Welcome!')).toBeInTheDocument();
});

it("shows the user's first name (or a Welcome fallback) and a sign-out option when authenticated", () => {
  renderWithProviders(<Navigation />, {
    preloadedState: { authentication: { authenticated: true }, account: { user: { firstName: 'Jane' } } }
  });

  expect(screen.getByText('Jane')).toBeInTheDocument();
  expect(screen.getByText('Sign Out')).toBeInTheDocument();
});

it('falls back to "Welcome" when authenticated but the user has no firstName yet', () => {
  renderWithProviders(<Navigation />, {
    preloadedState: { authentication: { authenticated: true }, account: { user: {} } }
  });

  expect(screen.getByText('Welcome')).toBeInTheDocument();
});

it('re-fetches brands when the brand dropdown is toggled open', async () => {
  mock.onGet(`${API_URL}/brand/list`).reply(200, { brands: [brand] });
  mock.onGet(`${API_URL}/category/list`).reply(200, { categories: [] });

  renderWithProviders(<Navigation />, { preloadedState: { authentication: { authenticated: false } } });

  await screen.findByText('Brands');
  expect(mock.history.get.filter(r => r.url === `${API_URL}/brand/list`)).toHaveLength(1);

  fireEvent.click(screen.getByText('Brands'));

  await vi.waitFor(() =>
    expect(mock.history.get.filter(r => r.url === `${API_URL}/brand/list`)).toHaveLength(2)
  );
});

it('typing in the search box dispatches onSearch and updates the real store', () => {
  renderWithProviders(<Navigation />, { preloadedState: { authentication: { authenticated: false } } });

  const input = screen.getByPlaceholderText('Search Products');
  fireEvent.change(input, { target: { value: 'widget' } });

  expect(input).toHaveValue('widget');
});

it('opens the cart drawer and closes it via the backdrop, wired to toggleCart', () => {
  const { container } = renderWithProviders(<Navigation />, {
    preloadedState: { authentication: { authenticated: false }, navigation: { isCartOpen: true, isMenuOpen: false, isBrandOpen: false, searchValue: '', searchSuggestions: [] } }
  });

  expect(container.querySelector('.mini-cart-open')).toBeInTheDocument();
});

it('renders a highlighted, partially-matched suggestion and navigates to it when selected', () => {
  // "Widget Deluxe" vs the "widget" query leaves " Deluxe" unmatched,
  // exercising both the highlighted and plain (non-highlighted) render
  // branches of BoldName.
  const suggestion = { _id: 'p1', slug: 'widget-deluxe', name: 'Widget Deluxe', imageUrl: '', price: 10 };

  renderWithProviders(<Navigation />, {
    route: '/shop',
    preloadedState: {
      authentication: { authenticated: false },
      navigation: {
        isMenuOpen: false,
        isCartOpen: false,
        isBrandOpen: false,
        searchValue: 'widget',
        searchSuggestions: [suggestion]
      }
    }
  });

  const input = screen.getByPlaceholderText('Search Products');
  fireEvent.focus(input);
  fireEvent.change(input, { target: { value: 'widget' } });

  const option = screen.getByRole('option');
  expect(option).toHaveTextContent('Widget Deluxe');
  expect(option).toHaveTextContent('$10');

  fireEvent.click(option);
});

it('re-fetches categories when the desktop menu-toggle button is clicked', async () => {
  mock.onGet(`${API_URL}/brand/list`).reply(200, { brands: [] });
  mock.onGet(`${API_URL}/category/list`).reply(200, { categories: [category] });

  renderWithProviders(<Navigation />, {
    preloadedState: { authentication: { authenticated: false } }
  });

  await screen.findByText('Shop By Category');
  expect(mock.history.get.filter(r => r.url === `${API_URL}/category/list`)).toHaveLength(1);

  // Both the desktop and mobile headers render their own "open the menu"
  // button (only the desktop one renders at all once categories are
  // present) — either click reaches the same toggleMenu() method.
  const [menuButton] = screen.getAllByRole('button', { name: 'open the menu' });
  fireEvent.click(menuButton);

  await vi.waitFor(() =>
    expect(mock.history.get.filter(r => r.url === `${API_URL}/category/list`)).toHaveLength(2)
  );
});
