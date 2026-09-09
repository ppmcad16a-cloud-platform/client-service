import React from 'react';
import { render, screen } from '@testing-library/react';
import axios from 'axios';

vi.mock('./containers/Application', () => ({ default: () => <div>ApplicationContainer</div> }));
vi.mock('./contexts/Socket', () => ({ SocketProvider: ({ children }) => <>{children}</> }));
vi.mock('./scrollToTop', () => ({ default: ({ children }) => <>{children}</> }));

afterEach(() => {
  localStorage.clear();
  delete axios.defaults.headers.common['Authorization'];
});

it('renders the full provider/router tree wrapping Application', async () => {
  vi.resetModules();
  const { default: app } = await import('./app');
  const App = app;

  render(<App />);

  expect(screen.getByText('ApplicationContainer')).toBeInTheDocument();
});

it('optimistically authenticates from a stored token on load: sets the axios header and dispatches SET_AUTH', async () => {
  localStorage.setItem('token', 'Bearer stored-token');

  vi.resetModules();
  const { default: app } = await import('./app');
  const { default: store } = await import('./store');

  expect(axios.defaults.headers.common['Authorization']).toBe('Bearer stored-token');
  expect(store.getState().authentication.authenticated).toBe(true);

  render(React.createElement(app));
  expect(screen.getByText('ApplicationContainer')).toBeInTheDocument();
});

it('does not authenticate when no token is stored', async () => {
  vi.resetModules();
  const { default: store } = await import('./store');

  expect(axios.defaults.headers.common['Authorization']).toBeUndefined();
  expect(store.getState().authentication.authenticated).toBe(false);
});
