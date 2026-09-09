import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import Edit from 'app/containers/Category/Edit';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL } from 'app/constants';

const mock = new MockAdapter(axios);
const history = { goBack: vi.fn() };

afterEach(() => {
  mock.reset();
  history.goBack.mockClear();
});

it('resets the category form, fetches the category and product select options on mount, and renders pre-filled', async () => {
  mock.onGet(`${API_URL}/category/c1`).reply(200, {
    category: { _id: 'c1', name: 'Gadgets', slug: 'gadgets', description: 'Tech stuff', isActive: true, products: [] }
  });
  mock.onGet(`${API_URL}/product/list/select`).reply(200, { products: [] });

  renderWithProviders(<Edit match={{ params: { id: 'c1' } }} history={history} />);

  expect(await screen.findByDisplayValue('Gadgets')).toBeInTheDocument();
});

it('shows "No category found." when the category has no id', async () => {
  mock.onGet(`${API_URL}/category/missing`).reply(404);
  mock.onGet(`${API_URL}/product/list/select`).reply(200, { products: [] });

  renderWithProviders(<Edit match={{ params: { id: 'missing' } }} history={history} />);

  expect(await screen.findByText('No category found.')).toBeInTheDocument();
});

it('re-fetches when the category id param changes', async () => {
  mock.onGet(`${API_URL}/category/c1`).reply(200, {
    category: { _id: 'c1', name: 'Gadgets', slug: 'gadgets', description: 'Tech stuff', isActive: true, products: [] }
  });
  mock.onGet(`${API_URL}/product/list/select`).reply(200, { products: [] });

  const { rerender } = renderWithProviders(<Edit match={{ params: { id: 'c1' } }} history={history} />);

  await screen.findByDisplayValue('Gadgets');

  mock.onGet(`${API_URL}/category/c2`).reply(200, {
    category: { _id: 'c2', name: 'Gizmos', slug: 'gizmos', description: 'Other stuff', isActive: true, products: [] }
  });

  rerender(<Edit match={{ params: { id: 'c2' } }} history={history} />);

  expect(await screen.findByDisplayValue('Gizmos')).toBeInTheDocument();
});

it('the Cancel action goes back', async () => {
  mock.onGet(`${API_URL}/category/c1`).reply(200, {
    category: { _id: 'c1', name: 'Gadgets', slug: 'gadgets', description: 'Tech stuff', isActive: true, products: [] }
  });
  mock.onGet(`${API_URL}/product/list/select`).reply(200, { products: [] });

  renderWithProviders(<Edit match={{ params: { id: 'c1' } }} history={history} />);

  fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
  expect(history.goBack).toHaveBeenCalledTimes(1);
});

it('calls deleteCategory with the category id when Delete is clicked', async () => {
  mock.onGet(`${API_URL}/category/c1`).reply(200, {
    category: { _id: 'c1', name: 'Gadgets', slug: 'gadgets', description: 'Tech stuff', isActive: true, products: [] }
  });
  mock.onGet(`${API_URL}/product/list/select`).reply(200, { products: [] });
  mock.onDelete(`${API_URL}/category/delete/c1`).reply(200, { success: true, message: 'Deleted!' });

  renderWithProviders(<Edit match={{ params: { id: 'c1' } }} history={history} />);

  await screen.findByDisplayValue('Gadgets');
  fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

  await vi.waitFor(() => expect(mock.history.delete).toHaveLength(1));
});
