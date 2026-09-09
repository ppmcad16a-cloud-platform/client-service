import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import Add from 'app/containers/Category/Add';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL } from 'app/constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

it('fetches the product select options on mount and renders the form', async () => {
  mock.onGet(`${API_URL}/product/list/select`).reply(200, { products: [{ _id: 'p1', name: 'Widget' }] });

  renderWithProviders(<Add history={{ goBack: vi.fn() }} />);

  expect(screen.getByRole('heading', { name: 'Add Category' })).toBeInTheDocument();
  await vi.waitFor(() => expect(mock.history.get).toHaveLength(1));
});

it('the Cancel action goes back', () => {
  const history = { goBack: vi.fn() };
  renderWithProviders(<Add history={history} />);

  fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
  expect(history.goBack).toHaveBeenCalledTimes(1);
});

it('typing into a field dispatches categoryChange and updates the real store', () => {
  renderWithProviders(<Add history={{ goBack: vi.fn() }} />);

  const input = screen.getByPlaceholderText('Category Name');
  fireEvent.change(input, { target: { value: 'Gadgets' } });

  expect(input).toHaveValue('Gadgets');
});

it('submitting a valid form calls addCategory, which hits the real category/add endpoint', async () => {
  mock.onPost(`${API_URL}/category/add`).reply(200, { success: true, message: 'Category added!', category: { _id: '1' } });

  const validForm = { name: 'Gadgets', description: 'Tech stuff', products: [{ value: 'p1', label: 'Widget' }], isActive: true };

  const { container } = renderWithProviders(<Add history={{ goBack: vi.fn() }} />, {
    preloadedState: { category: { categoryFormData: validForm, formErrors: {} } }
  });

  fireEvent.submit(container.querySelector('form'));

  await vi.waitFor(() => expect(mock.history.post).toHaveLength(1));
});
