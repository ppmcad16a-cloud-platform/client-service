import React from 'react';
import { screen } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import BrandsPage from 'app/containers/BrandsPage';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL } from 'app/constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

it('fetches store brands on mount and renders them', async () => {
  mock.onGet(`${API_URL}/brand/list`).reply(200, {
    brands: [{ _id: '1', slug: 'acme', name: 'Acme', description: 'Fine goods' }]
  });

  renderWithProviders(<BrandsPage />);

  expect(await screen.findByText('Acme')).toBeInTheDocument();
});
