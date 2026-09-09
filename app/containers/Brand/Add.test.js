import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import Add from 'app/containers/Brand/Add';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL } from 'app/constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

it('renders the add-brand form with a Cancel action that goes back', () => {
  const history = { goBack: vi.fn() };
  renderWithProviders(<Add history={history} />);

  expect(screen.getByRole('heading', { name: 'Add Brand' })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
  expect(history.goBack).toHaveBeenCalledTimes(1);
});

it('typing into a field dispatches brandChange and updates the real store', () => {
  renderWithProviders(<Add history={{ goBack: vi.fn() }} />);

  const input = screen.getByPlaceholderText('Brand Name');
  fireEvent.change(input, { target: { value: 'Acme' } });

  expect(input).toHaveValue('Acme');
});

it('submitting a valid form calls addBrand, which hits the real brand/add endpoint', async () => {
  mock.onPost(`${API_URL}/brand/add`).reply(200, { success: true, message: 'Brand added!', brand: { _id: '1' } });

  const validForm = { name: 'Acme', description: 'Fine goods', isActive: true };

  const { container } = renderWithProviders(<Add history={{ goBack: vi.fn() }} />, {
    preloadedState: { brand: { brandFormData: validForm, formErrors: {} } }
  });

  fireEvent.submit(container.querySelector('form'));

  await vi.waitFor(() => expect(mock.history.post).toHaveLength(1));
});
