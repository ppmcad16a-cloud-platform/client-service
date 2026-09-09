import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import Review from 'app/containers/Review';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL, REVIEW_STATUS } from 'app/constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

const review = {
  _id: 'r1',
  title: 'Great!',
  review: 'Loved it',
  rating: 5,
  created: '2024-01-01T00:00:00.000Z',
  user: { _id: 'u1', firstName: 'Jane' },
  product: { slug: 'widget', name: 'Widget', imageUrl: '' },
  status: REVIEW_STATUS.Waiting_Approval
};

it('fetches reviews on mount and renders them with pagination when there are multiple pages', async () => {
  mock.onGet(`${API_URL}/review`).reply(200, { reviews: [review], totalPages: 2, currentPage: 1, count: 15 });

  renderWithProviders(<Review />);

  expect(await screen.findByText('Great!')).toBeInTheDocument();
  expect(screen.getByText('15 reviews')).toBeInTheDocument();
  expect(document.querySelector('.pagination')).toBeInTheDocument();
});

it('shows "No reviews found." when the list is empty', async () => {
  mock.onGet(`${API_URL}/review`).reply(200, { reviews: [], totalPages: 1, currentPage: 1, count: 0 });

  renderWithProviders(<Review />);

  expect(await screen.findByText('No reviews found.')).toBeInTheDocument();
});

it('approves a review from the list', async () => {
  mock.onGet(`${API_URL}/review`).reply(200, { reviews: [review], totalPages: 1, currentPage: 1, count: 1 });
  mock.onPut(`${API_URL}/review/approve/r1`).reply(200, {});

  renderWithProviders(<Review />);

  await screen.findByText('Great!');
  fireEvent.click(screen.getByRole('button', { name: 'Approve' }));

  await vi.waitFor(() => expect(mock.history.put.some(r => r.url === `${API_URL}/review/approve/r1`)).toBe(true));
});

it('rejects a review from the list', async () => {
  mock.onGet(`${API_URL}/review`).reply(200, { reviews: [review], totalPages: 1, currentPage: 1, count: 1 });
  mock.onPut(`${API_URL}/review/reject/r1`).reply(200, {});

  renderWithProviders(<Review />);

  await screen.findByText('Great!');
  fireEvent.click(screen.getByRole('button', { name: 'Reject' }));

  await vi.waitFor(() => expect(mock.history.put.some(r => r.url === `${API_URL}/review/reject/r1`)).toBe(true));
});

it('deletes a review from the list', async () => {
  mock.onGet(`${API_URL}/review`).reply(200, { reviews: [review], totalPages: 1, currentPage: 1, count: 1 });
  mock.onDelete(`${API_URL}/review/delete/r1`).reply(200, { success: true, message: 'Deleted!' });

  renderWithProviders(<Review />);

  await screen.findByText('Great!');
  fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

  await vi.waitFor(() => expect(mock.history.delete.some(r => r.url === `${API_URL}/review/delete/r1`)).toBe(true));
});

it('re-fetches the given page via Pagination', async () => {
  mock.onGet(`${API_URL}/review`).reply(200, { reviews: [review], totalPages: 2, currentPage: 1, count: 15 });

  renderWithProviders(<Review />);

  await screen.findByText('Great!');
  fireEvent.click(screen.getByText('2'));

  await vi.waitFor(() => expect(mock.history.get.filter(r => r.url === `${API_URL}/review`)).toHaveLength(2));
});
