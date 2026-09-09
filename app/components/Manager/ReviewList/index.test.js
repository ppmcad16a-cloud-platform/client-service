import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import ReviewList from 'app/components/Manager/ReviewList';
import { REVIEW_STATUS } from 'app/constants';

const baseReview = {
  _id: '1',
  title: 'Great!',
  review: 'Loved it',
  rating: 4,
  created: '2024-01-01T00:00:00.000Z',
  user: { _id: 'u1', firstName: 'Jane' },
  product: { slug: 'widget', name: 'Widget', imageUrl: '' }
};

const renderIt = (review, handlers = {}) =>
  render(
    <ReviewList
      reviews={[review]}
      approveReview={handlers.approveReview || vi.fn()}
      rejectReview={handlers.rejectReview || vi.fn()}
      deleteReview={handlers.deleteReview || vi.fn()}
    />,
    { wrapper: MemoryRouter }
  );

it("shows the reviewer's initial avatar and the linked product", () => {
  renderIt({ ...baseReview, status: REVIEW_STATUS.Approved });

  expect(screen.getAllByText('J').length).toBeGreaterThan(0);
  expect(screen.getByText('Widget')).toHaveAttribute('href', '/product/widget');
});

it('shows no avatar when the reviewer has no firstName', () => {
  renderIt({ ...baseReview, status: REVIEW_STATUS.Approved, user: { _id: 'u1' } });

  expect(screen.queryByText('J')).not.toBeInTheDocument();
});

it('shows "Product is not available." when the product is gone', () => {
  renderIt({ ...baseReview, status: REVIEW_STATUS.Approved, product: null });

  expect(screen.getByText('Product is not available.')).toBeInTheDocument();
});

describe('Approved status', () => {
  it('shows only a delete action', () => {
    const deleteReview = vi.fn();
    renderIt({ ...baseReview, status: REVIEW_STATUS.Approved }, { deleteReview });

    expect(screen.getByText('Approved')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(deleteReview).toHaveBeenCalledWith('1');
  });
});

describe('Rejected status', () => {
  it('shows approve and delete actions', () => {
    const approveReview = vi.fn();
    const deleteReview = vi.fn();
    renderIt({ ...baseReview, status: REVIEW_STATUS.Rejected }, { approveReview, deleteReview });

    expect(screen.getByText('Re Approve Review')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Approve' }));
    expect(approveReview).toHaveBeenCalledWith(expect.objectContaining({ _id: '1' }));

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(deleteReview).toHaveBeenCalledWith('1');
  });
});

describe('Waiting_Approval status', () => {
  it('shows approve, reject, and delete actions', () => {
    const approveReview = vi.fn();
    const rejectReview = vi.fn();
    const deleteReview = vi.fn();
    renderIt(
      { ...baseReview, status: REVIEW_STATUS.Waiting_Approval },
      { approveReview, rejectReview, deleteReview }
    );

    fireEvent.click(screen.getByRole('button', { name: 'Approve' }));
    expect(approveReview).toHaveBeenCalledWith(expect.objectContaining({ _id: '1' }));

    fireEvent.click(screen.getByRole('button', { name: 'Reject' }));
    expect(rejectReview).toHaveBeenCalledWith(expect.objectContaining({ _id: '1' }));

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(deleteReview).toHaveBeenCalledWith('1');
  });
});
