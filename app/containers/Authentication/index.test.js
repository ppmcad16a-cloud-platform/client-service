import React from 'react';
import { screen } from '@testing-library/react';

import Authentication from 'app/containers/Authentication';
import renderWithProviders from '../../../tests/renderWithProviders';

const Protected = () => <div>Protected content</div>;

it('redirects to /login when not authenticated', () => {
  const Wrapped = Authentication(Protected);

  renderWithProviders(<Wrapped />, {
    route: '/dashboard',
    preloadedState: { authentication: { authenticated: false } }
  });

  expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
});

it('renders the wrapped component when authenticated', () => {
  const Wrapped = Authentication(Protected);

  renderWithProviders(<Wrapped />, {
    route: '/dashboard',
    preloadedState: { authentication: { authenticated: true } }
  });

  expect(screen.getByText('Protected content')).toBeInTheDocument();
});

it('passes its own props through to the wrapped component', () => {
  const Labeled = ({ label }) => <div>{label}</div>;
  const Wrapped = Authentication(Labeled);

  renderWithProviders(<Wrapped label='hello' />, {
    preloadedState: { authentication: { authenticated: true } }
  });

  expect(screen.getByText('hello')).toBeInTheDocument();
});
