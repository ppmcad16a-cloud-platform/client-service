import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import Application from 'app/containers/Application';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL, CART_ITEMS } from 'app/constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

// Application's own job is the top-level route table + a handful of
// document-level listeners wired up in componentDidMount — the real
// (Redux/API-backed) page containers each have their own dedicated tests
// elsewhere, so they're stubbed out here. vi.mock calls are hoisted above
// these imports by Vitest regardless of source order.
vi.mock('app/containers/Login', () => ({ default: () => <div>LoginContainer</div> }));
vi.mock('app/containers/Signup', () => ({ default: () => <div>SignupContainer</div> }));
vi.mock('app/containers/MerchantSignup', () => ({ default: () => <div>MerchantSignupContainer</div> }));
vi.mock('app/containers/Homepage', () => ({ default: () => <div>HomepageContainer</div> }));
vi.mock('app/containers/Dashboard', () => ({ default: () => <div>DashboardContainer</div> }));
vi.mock('app/containers/Support', () => ({ default: () => <div>SupportContainer</div> }));
vi.mock('app/containers/Navigation', () => ({ default: () => <div>NavigationContainer</div> }));
vi.mock('app/containers/Authentication', () => ({
  default: Component => props => <Component {...props} />
}));
vi.mock('app/containers/Notification', () => ({ default: () => <div>NotificationContainer</div> }));
vi.mock('app/containers/ForgotPassword', () => ({ default: () => <div>ForgotPasswordContainer</div> }));
vi.mock('app/containers/ResetPassword', () => ({ default: () => <div>ResetPasswordContainer</div> }));
vi.mock('app/containers/Shop', () => ({ default: () => <div>ShopContainer</div> }));
vi.mock('app/containers/BrandsPage', () => ({ default: () => <div>BrandsPageContainer</div> }));
vi.mock('app/containers/ProductPage', () => ({ default: () => <div>ProductPageContainer</div> }));
vi.mock('app/containers/Sell', () => ({ default: () => <div>SellContainer</div> }));
vi.mock('app/containers/Contact', () => ({ default: () => <div>ContactContainer</div> }));
vi.mock('app/containers/OrderSuccess', () => ({ default: () => <div>OrderSuccessContainer</div> }));
vi.mock('app/containers/OrderPage', () => ({ default: () => <div>OrderPageContainer</div> }));

const renderAt = route =>
  renderWithProviders(<Application />, {
    route,
    preloadedState: { authentication: { authenticated: true } }
  });

it.each([
  ['/', 'HomepageContainer'],
  ['/shop', 'ShopContainer'],
  ['/sell', 'SellContainer'],
  ['/contact', 'ContactContainer'],
  ['/brands', 'BrandsPageContainer'],
  ['/product/widget', 'ProductPageContainer'],
  ['/order/success/order-1', 'OrderSuccessContainer'],
  ['/order/order-1', 'OrderPageContainer'],
  ['/login', 'LoginContainer'],
  ['/register', 'SignupContainer'],
  ['/merchant-signup/tok', 'MerchantSignupContainer'],
  ['/forgot-password', 'ForgotPasswordContainer'],
  ['/reset-password/tok', 'ResetPasswordContainer'],
  ['/support', 'SupportContainer'],
  ['/dashboard', 'DashboardContainer']
])('renders %s as %s', (route, expectedText) => {
  renderAt(route);
  expect(screen.getByText(expectedText)).toBeInTheDocument();
});

it('renders Page404 for an unmatched route', () => {
  renderAt('/does-not-exist');
  expect(screen.getByText('The page you are looking for was not found.')).toBeInTheDocument();
});

it('renders Page404 at the explicit /404 route', () => {
  renderAt('/404');
  expect(screen.getByText('The page you are looking for was not found.')).toBeInTheDocument();
});

it('always renders Navigation, Notification, and Footer alongside the routed page', () => {
  renderAt('/');
  expect(screen.getByText('NavigationContainer')).toBeInTheDocument();
  expect(screen.getByText('NotificationContainer')).toBeInTheDocument();
  expect(screen.getByText('© ' + new Date().getFullYear() + ' MERN Store')).toBeInTheDocument();
});

it('fetches the profile when a token is already stored (optimistic auth restore)', async () => {
  mock.onGet(`${API_URL}/user/me`).reply(200, { user: { _id: 'u1', firstName: 'Jane' } });
  localStorage.setItem('token', 'Bearer tok');

  renderAt('/');

  await vi.waitFor(() => expect(mock.history.get.some(r => r.url === `${API_URL}/user/me`)).toBe(true));

  localStorage.clear();
});

it('does not fetch the profile when no token is stored', () => {
  renderAt('/');

  expect(mock.history.get).toHaveLength(0);
});

it('hydrates the cart from localStorage on mount', () => {
  localStorage.setItem(CART_ITEMS, JSON.stringify([{ _id: '1', price: 10, quantity: 1 }]));

  const { store } = renderAt('/');

  expect(store.getState().cart.cartItems).toEqual([{ _id: '1', price: 10, quantity: 1 }]);

  localStorage.clear();
});

it('re-hydrates the cart when another tab changes CART_ITEMS via the storage event', () => {
  const { store } = renderAt('/');

  localStorage.setItem(CART_ITEMS, JSON.stringify([{ _id: '2', price: 5, quantity: 3 }]));
  fireEvent(window, new StorageEvent('storage', { key: CART_ITEMS }));

  expect(store.getState().cart.cartItems).toEqual([{ _id: '2', price: 5, quantity: 3 }]);

  localStorage.clear();
});

it('ignores storage events for unrelated keys', () => {
  const { store } = renderAt('/');
  const before = store.getState().cart.cartItems;

  localStorage.setItem('some_other_key', 'x');
  fireEvent(window, new StorageEvent('storage', { key: 'some_other_key' }));

  expect(store.getState().cart.cartItems).toEqual(before);
});

it('adds the user-is-tabbing class on Tab keydown and removes it on mousedown', () => {
  renderAt('/');

  fireEvent.keyDown(document, { keyCode: 9 });
  expect(document.body).toHaveClass('user-is-tabbing');

  fireEvent.mouseDown(document);
  expect(document.body).not.toHaveClass('user-is-tabbing');
});

it('ignores non-Tab keydowns', () => {
  renderAt('/');

  fireEvent.keyDown(document, { keyCode: 13 });
  expect(document.body).not.toHaveClass('user-is-tabbing');
});
