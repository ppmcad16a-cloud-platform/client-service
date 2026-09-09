import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import List from 'app/containers/Category/List';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL } from 'app/constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

it('fetches categories on mount and renders them', async () => {
  mock.onGet(`${API_URL}/category`).reply(200, { categories: [{ _id: '1', name: 'Gadgets', description: 'Tech stuff' }] });

  renderWithProviders(<List history={{ push: vi.fn() }} />);

  expect(await screen.findByText('Gadgets')).toBeInTheDocument();
});

it('shows "No categories found." when the list is empty', async () => {
  mock.onGet(`${API_URL}/category`).reply(200, { categories: [] });

  renderWithProviders(<List history={{ push: vi.fn() }} />);

  expect(await screen.findByText('No categories found.')).toBeInTheDocument();
});

it('navigates to the add-category page when "Add" is clicked', async () => {
  mock.onGet(`${API_URL}/category`).reply(200, { categories: [] });
  const history = { push: vi.fn() };

  renderWithProviders(<List history={history} />);

  await screen.findByText('No categories found.');
  fireEvent.click(screen.getByRole('button', { name: 'Add' }));

  expect(history.push).toHaveBeenCalledWith('/dashboard/category/add');
});
