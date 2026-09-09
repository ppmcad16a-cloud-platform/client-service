import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import Edit from 'app/containers/Brand/Edit';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL, ROLES } from 'app/constants';

const mock = new MockAdapter(axios);
const history = { goBack: vi.fn() };

afterEach(() => {
  mock.reset();
  history.goBack.mockClear();
});

it('fetches the brand on mount and renders it pre-filled', async () => {
  mock.onGet(`${API_URL}/brand/b1`).reply(200, {
    brand: { _id: 'b1', name: 'Acme', slug: 'acme', description: 'Fine goods', isActive: true }
  });

  renderWithProviders(<Edit match={{ params: { id: 'b1' } }} history={history} />, {
    preloadedState: { account: { user: { role: ROLES.Admin } } }
  });

  expect(await screen.findByDisplayValue('Acme')).toBeInTheDocument();
});

it('shows "No brand found." when the brand has no id', async () => {
  mock.onGet(`${API_URL}/brand/missing`).reply(404);

  renderWithProviders(<Edit match={{ params: { id: 'missing' } }} history={history} />, {
    preloadedState: { account: { user: { role: ROLES.Admin } } }
  });

  expect(await screen.findByText('No brand found.')).toBeInTheDocument();
});

it('re-fetches when the brand id param changes', async () => {
  mock.onGet(`${API_URL}/brand/b1`).reply(200, {
    brand: { _id: 'b1', name: 'Acme', slug: 'acme', description: 'Fine goods', isActive: true }
  });

  const { rerender } = renderWithProviders(<Edit match={{ params: { id: 'b1' } }} history={history} />, {
    preloadedState: { account: { user: { role: ROLES.Admin } } }
  });

  await screen.findByDisplayValue('Acme');

  mock.onGet(`${API_URL}/brand/b2`).reply(200, {
    brand: { _id: 'b2', name: 'Globex', slug: 'globex', description: 'Other goods', isActive: true }
  });

  rerender(<Edit match={{ params: { id: 'b2' } }} history={history} />);

  expect(await screen.findByDisplayValue('Globex')).toBeInTheDocument();
});

it('the Cancel action goes back', () => {
  renderWithProviders(<Edit match={{ params: { id: 'b1' } }} history={history} />, {
    preloadedState: { account: { user: { role: ROLES.Admin } } }
  });

  fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
  expect(history.goBack).toHaveBeenCalledTimes(1);
});

it('calls deleteBrand with the brand id when Delete is clicked', async () => {
  mock.onGet(`${API_URL}/brand/b1`).reply(200, {
    brand: { _id: 'b1', name: 'Acme', slug: 'acme', description: 'Fine goods', isActive: true }
  });
  mock.onDelete(`${API_URL}/brand/delete/b1`).reply(200, { success: true, message: 'Deleted!' });

  renderWithProviders(<Edit match={{ params: { id: 'b1' } }} history={history} />, {
    preloadedState: { account: { user: { role: ROLES.Admin } } }
  });

  await screen.findByDisplayValue('Acme');
  fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

  await vi.waitFor(() => expect(mock.history.delete).toHaveLength(1));
});
