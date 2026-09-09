import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import Add from 'app/containers/Product/Add';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL, ROLES } from 'app/constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

it('fetches brand select options on mount and renders the form with a Cancel action', async () => {
  mock.onGet(`${API_URL}/brand/list/select`).reply(200, { brands: [{ _id: 'b1', name: 'Acme' }] });
  const history = { goBack: vi.fn() };

  renderWithProviders(<Add history={history} />, {
    preloadedState: { account: { user: { role: ROLES.Admin } } }
  });

  expect(screen.getByRole('heading', { name: 'Add Product' })).toBeInTheDocument();
  await vi.waitFor(() => expect(mock.history.get).toHaveLength(1));

  fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
  expect(history.goBack).toHaveBeenCalledTimes(1);
});

it('submitting a valid form calls addProduct, which hits the real product/add endpoint', async () => {
  mock.onGet(`${API_URL}/brand/list/select`).reply(200, { brands: [] });
  mock.onPost(`${API_URL}/product/add`).reply(200, { success: true, message: 'Product added!', product: { _id: '1' } });

  const validForm = {
    sku: 'ABC-1',
    name: 'Widget',
    description: 'A fine widget',
    imageUrl: '',
    quantity: '10',
    price: '9.99',
    taxable: { value: 1, label: 'Yes' },
    brand: { value: 'b1', label: 'Acme' },
    isActive: true
  };

  const { container } = renderWithProviders(<Add history={{ goBack: vi.fn() }} />, {
    preloadedState: {
      account: { user: { role: ROLES.Admin } },
      product: { productFormData: validForm, formErrors: {} },
      brand: { brandsSelect: [] }
    }
  });

  fireEvent.submit(container.querySelector('form'));

  await vi.waitFor(() => expect(mock.history.post).toHaveLength(1));
});
