import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import Admin from 'app/components/Manager/Dashboard/Admin';

// Admin.js's own job is just the route table + AccountMenu wiring, so the
// real (Redux/API-backed) containers are stubbed out here — each container
// has its own dedicated tests elsewhere. vi.mock calls are hoisted above
// these imports by Vitest regardless of source order.
vi.mock('app/containers/Account', () => ({ default: () => <div>AccountContainer</div> }));
vi.mock('app/containers/AccountSecurity', () => ({ default: () => <div>AccountSecurityContainer</div> }));
vi.mock('app/containers/Address', () => ({ default: () => <div>AddressContainer</div> }));
vi.mock('app/containers/Order', () => ({ default: () => <div>OrderContainer</div> }));
vi.mock('app/containers/Users', () => ({ default: () => <div>UsersContainer</div> }));
vi.mock('app/containers/Category', () => ({ default: () => <div>CategoryContainer</div> }));
vi.mock('app/containers/Product', () => ({ default: () => <div>ProductContainer</div> }));
vi.mock('app/containers/Brand', () => ({ default: () => <div>BrandContainer</div> }));
vi.mock('app/containers/Merchant', () => ({ default: () => <div>MerchantContainer</div> }));
vi.mock('app/containers/Review', () => ({ default: () => <div>ReviewContainer</div> }));
vi.mock('app/containers/WishList', () => ({ default: () => <div>WishlistContainer</div> }));

const renderAt = route => render(<Admin links={[]} isMenuOpen={false} toggleMenu={() => {}} />, {
  wrapper: ({ children }) => <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
});

it.each([
  ['/dashboard', 'AccountContainer'],
  ['/dashboard/security', 'AccountSecurityContainer'],
  ['/dashboard/address', 'AddressContainer'],
  ['/dashboard/product', 'ProductContainer'],
  ['/dashboard/category', 'CategoryContainer'],
  ['/dashboard/brand', 'BrandContainer'],
  ['/dashboard/users', 'UsersContainer'],
  ['/dashboard/merchant', 'MerchantContainer'],
  ['/dashboard/orders', 'OrderContainer'],
  ['/dashboard/review', 'ReviewContainer'],
  ['/dashboard/wishlist', 'WishlistContainer']
])('renders %s as %s', (route, expectedText) => {
  renderAt(route);
  expect(screen.getByText(expectedText)).toBeInTheDocument();
});

it('renders Page404 for an unmatched route', () => {
  renderAt('/dashboard/does-not-exist');
  expect(screen.getByText('The page you are looking for was not found.')).toBeInTheDocument();
});

it('renders the AccountMenu alongside the routed content', () => {
  renderAt('/dashboard');
  expect(screen.getByText('Account')).toBeInTheDocument();
});
