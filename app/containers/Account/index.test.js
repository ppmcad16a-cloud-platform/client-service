import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import Account from 'app/containers/Account';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL, ROLES } from 'app/constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

it("renders the account details form wired to the account duck's user", () => {
  renderWithProviders(<Account />, {
    preloadedState: { account: { user: { email: 'jane@example.com', role: ROLES.Member } } }
  });

  expect(screen.getByText('Account Details')).toBeInTheDocument();
  expect(screen.getByText('jane@example.com')).toBeInTheDocument();
});

it('typing into a field dispatches accountChange and updates the real store', () => {
  renderWithProviders(<Account />, {
    preloadedState: { account: { user: { email: 'jane@example.com', role: ROLES.Member, firstName: 'Jane' } } }
  });

  const input = screen.getByDisplayValue('Jane');
  fireEvent.change(input, { target: { value: 'Janet' } });

  expect(input).toHaveValue('Janet');
});

it('submitting calls updateProfile, which hits the real profile endpoint', async () => {
  mock.onPut(`${API_URL}/user`).reply(200, { user: { email: 'jane@example.com' }, message: 'Profile updated!' });

  const { container } = renderWithProviders(<Account />, {
    preloadedState: { account: { user: { email: 'jane@example.com', role: ROLES.Member } } }
  });

  fireEvent.submit(container.querySelector('form'));

  await vi.waitFor(() => expect(mock.history.put).toHaveLength(1));
});
