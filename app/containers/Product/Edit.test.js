import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import Edit from 'app/containers/Product/Edit';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL, ROLES } from 'app/constants';

const mock = new MockAdapter(axios);
const history = { goBack: vi.fn() };

afterEach(() => {
  mock.reset();
  history.goBack.mockClear();
});

it('resets the product form, fetches the product and brand select options on mount, and renders pre-filled', async () => {
  mock.onGet(`${API_URL}/product/p1`).reply(200, {
    product: { _id: 'p1', name: 'Widget', sku: 'ABC-1', slug: 'widget', description: 'A fine widget', quantity: 10, price: 9.99, taxable: true, imageUrl: '', brand: { value: 'b1', label: 'Acme' }, isActive: true }
  });
  mock.onGet(`${API_URL}/brand/list/select`).reply(200, { brands: [] });

  renderWithProviders(<Edit match={{ params: { id: 'p1' } }} history={history} />, {
    preloadedState: { account: { user: { role: ROLES.Admin } } }
  });

  expect(await screen.findByDisplayValue('Widget')).toBeInTheDocument();
});

it('shows "No product found." when the product has no id', async () => {
  mock.onGet(`${API_URL}/product/missing`).reply(404);
  mock.onGet(`${API_URL}/brand/list/select`).reply(200, { brands: [] });

  renderWithProviders(<Edit match={{ params: { id: 'missing' } }} history={history} />, {
    preloadedState: { account: { user: { role: ROLES.Admin } } }
  });

  expect(await screen.findByText('No product found.')).toBeInTheDocument();
});

it('re-fetches when the product id param changes', async () => {
  mock.onGet(`${API_URL}/product/p1`).reply(200, {
    product: { _id: 'p1', name: 'Widget', sku: 'ABC-1', slug: 'widget', description: 'A fine widget', quantity: 10, price: 9.99, taxable: true, imageUrl: '', brand: { value: 'b1', label: 'Acme' }, isActive: true }
  });
  mock.onGet(`${API_URL}/brand/list/select`).reply(200, { brands: [] });

  const { rerender } = renderWithProviders(<Edit match={{ params: { id: 'p1' } }} history={history} />, {
    preloadedState: { account: { user: { role: ROLES.Admin } } }
  });

  await screen.findByDisplayValue('Widget');

  mock.onGet(`${API_URL}/product/p2`).reply(200, {
    product: { _id: 'p2', name: 'Gadget', sku: 'XYZ-2', slug: 'gadget', description: 'A fine gadget', quantity: 5, price: 15, taxable: false, imageUrl: '', brand: { value: 'b1', label: 'Acme' }, isActive: true }
  });

  rerender(<Edit match={{ params: { id: 'p2' } }} history={history} />);

  expect(await screen.findByDisplayValue('Gadget')).toBeInTheDocument();
});

it('the Cancel action goes back', () => {
  mock.onGet(`${API_URL}/product/p1`).reply(404);
  mock.onGet(`${API_URL}/brand/list/select`).reply(200, { brands: [] });

  renderWithProviders(<Edit match={{ params: { id: 'p1' } }} history={history} />, {
    preloadedState: { account: { user: { role: ROLES.Admin } } }
  });

  fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
  expect(history.goBack).toHaveBeenCalledTimes(1);
});

it('calls deleteProduct with the product id when Delete is clicked', async () => {
  mock.onGet(`${API_URL}/product/p1`).reply(200, {
    product: { _id: 'p1', name: 'Widget', sku: 'ABC-1', slug: 'widget', description: 'A fine widget', quantity: 10, price: 9.99, taxable: true, imageUrl: '', brand: { value: 'b1', label: 'Acme' }, isActive: true }
  });
  mock.onGet(`${API_URL}/brand/list/select`).reply(200, { brands: [] });
  mock.onDelete(`${API_URL}/product/delete/p1`).reply(200, { success: true, message: 'Deleted!' });

  renderWithProviders(<Edit match={{ params: { id: 'p1' } }} history={history} />, {
    preloadedState: { account: { user: { role: ROLES.Admin } } }
  });

  await screen.findByDisplayValue('Widget');
  fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

  await vi.waitFor(() => expect(mock.history.delete).toHaveLength(1));
});
