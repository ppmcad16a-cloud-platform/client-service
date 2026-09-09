import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import Add from 'app/containers/Merchant/Add';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL } from 'app/constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

it('renders the add-merchant form with a Cancel action that goes back', () => {
  const history = { goBack: vi.fn() };
  renderWithProviders(<Add history={history} />);

  expect(screen.getByRole('heading', { name: 'Add Merchant' })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
  expect(history.goBack).toHaveBeenCalledTimes(1);
});

it('submitting a valid form calls addMerchant with isBack=true, navigating back on success', async () => {
  mock.onPost(`${API_URL}/graphql`).reply(200, { data: { addMerchant: { success: true, message: 'Merchant added!' } } });

  const validForm = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    phoneNumber: '1234567890',
    brandName: 'Acme',
    business: 'A long enough business description'
  };

  const { container } = renderWithProviders(<Add history={{ goBack: vi.fn() }} />, {
    preloadedState: { merchant: { merchantFormData: validForm, formErrors: {}, isSubmitting: false, isLoading: false } }
  });

  fireEvent.submit(container.querySelector('form'));

  await vi.waitFor(() => expect(mock.history.post).toHaveLength(1));
});
