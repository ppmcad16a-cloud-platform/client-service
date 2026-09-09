import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import List from 'app/containers/Product/List';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL } from 'app/constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

it('fetches products on mount and renders them', async () => {
  mock.onGet(`${API_URL}/product`).reply(200, { products: [{ _id: '1', name: 'Widget', description: 'A fine widget', imageUrl: '' }] });

  renderWithProviders(<List history={{ push: vi.fn() }} />);

  expect(await screen.findByText('Widget')).toBeInTheDocument();
});

it('shows "No products found." when the list is empty', async () => {
  mock.onGet(`${API_URL}/product`).reply(200, { products: [] });

  renderWithProviders(<List history={{ push: vi.fn() }} />);

  expect(await screen.findByText('No products found.')).toBeInTheDocument();
});

it('navigates to the add-product page when "Add" is clicked', async () => {
  mock.onGet(`${API_URL}/product`).reply(200, { products: [] });
  const history = { push: vi.fn() };

  renderWithProviders(<List history={history} />);

  await screen.findByText('No products found.');
  fireEvent.click(screen.getByRole('button', { name: 'Add' }));

  expect(history.push).toHaveBeenCalledWith('/dashboard/product/add');
});
