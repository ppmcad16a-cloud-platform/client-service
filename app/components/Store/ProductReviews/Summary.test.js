import React from 'react';
import { render, screen } from '@testing-library/react';

import Summary from 'app/components/Store/ProductReviews/Summary';

it('shows the average rating, review count, and per-star breakdown', () => {
  const reviewsSummary = {
    ratingSummary: [{ 5: 2 }, { 4: 1 }, { 3: 0 }, { 2: 0 }, { 1: 0 }],
    totalRatings: 14,
    totalReviews: 3,
    totalSummary: 3
  };

  render(<Summary reviewsSummary={reviewsSummary} />);

  expect(screen.getByText('based on 3 reviews.')).toBeInTheDocument();
  expect(screen.getByText('5 star')).toBeInTheDocument();
  expect(screen.getByText('66.67%')).toBeInTheDocument();
});

it('shows a "be the first" placeholder when there are no reviews', () => {
  const reviewsSummary = { ratingSummary: [], totalRatings: 0, totalReviews: 0, totalSummary: 0 };

  render(<Summary reviewsSummary={reviewsSummary} />);

  expect(screen.getByText('Be the first to add a review.')).toBeInTheDocument();
});

it('omits the stars-and-count block entirely when there are no ratings yet (averageRating is false, not 0)', () => {
  const reviewsSummary = { ratingSummary: [], totalRatings: 0, totalReviews: 0, totalSummary: 0 };

  const { container } = render(<Summary reviewsSummary={reviewsSummary} />);

  expect(container.querySelector('.react-stars-wrapper')).not.toBeInTheDocument();
});
