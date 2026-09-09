import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import Merchant from 'app/components/Manager/Dashboard/Merchant';

vi.mock('app/containers/Account', () => ({ default: () => <div>AccountContainer</div> }));
vi.mock('app/containers/AccountSecurity', () => ({ default: () => <div>AccountSecurityContainer</div> }));
vi.mock('app/containers/Address', () => ({ default: () => <div>AddressContainer</div> }));
vi.mock('app/containers/Product', () => ({ default: () => <div>ProductContainer</div> }));
vi.mock('app/containers/Brand', () => ({ default: () => <div>BrandContainer</div> }));
vi.mock('app/containers/Order', () => ({ default: () => <div>OrderContainer</div> }));
vi.mock('app/containers/WishList', () => ({ default: () => <div>WishlistContainer</div> }));

const renderAt = route =>
  render(<Merchant links={[]} isMenuOpen={false} toggleMenu={() => {}} />, {
    wrapper: ({ children }) => <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
  });

it.each([
  ['/dashboard', 'AccountContainer'],
  ['/dashboard/security', 'AccountSecurityContainer'],
  ['/dashboard/address', 'AddressContainer'],
  ['/dashboard/product', 'ProductContainer'],
  ['/dashboard/brand', 'BrandContainer'],
  ['/dashboard/orders', 'OrderContainer'],
  ['/dashboard/wishlist', 'WishlistContainer']
])('renders %s as %s', (route, expectedText) => {
  renderAt(route);
  expect(screen.getByText(expectedText)).toBeInTheDocument();
});

it('renders Page404 for an unmatched route', () => {
  renderAt('/dashboard/does-not-exist');
  expect(screen.getByText('The page you are looking for was not found.')).toBeInTheDocument();
});
