import React from 'react';
import { render, screen } from '@testing-library/react';

import ProductReviews from 'app/components/Store/ProductReviews';

const reviewFormData = { title: '', review: '', rating: 0, isRecommended: null };

it('renders the summary and review list when both are present', () => {
  render(
    <ProductReviews
      reviewsSummary={{ ratingSummary: [{ 5: 1 }], totalRatings: 5, totalReviews: 1, totalSummary: 1 }}
      reviews={[{ title: 'Great!', review: 'Loved it', rating: 5, created: '2024-01-01', user: { firstName: 'Jane' } }]}
      reviewFormData={reviewFormData}
      reviewChange={() => {}}
      reviewFormErrors={{}}
      addReview={() => {}}
    />
  );

  expect(screen.getByRole('heading', { name: 'Rating' })).toBeInTheDocument();
  expect(screen.getByText('Great!')).toBeInTheDocument();
  expect(screen.getByText('Add Review')).toBeInTheDocument();
});

it('omits the summary section when reviewsSummary is empty', () => {
  render(
    <ProductReviews
      reviewsSummary={{}}
      reviews={[]}
      reviewFormData={reviewFormData}
      reviewChange={() => {}}
      reviewFormErrors={{}}
      addReview={() => {}}
    />
  );

  expect(screen.queryByRole('heading', { name: 'Rating' })).not.toBeInTheDocument();
});

it('omits the review list when there are no reviews', () => {
  render(
    <ProductReviews
      reviewsSummary={{ ratingSummary: [], totalRatings: 0, totalReviews: 0, totalSummary: 0 }}
      reviews={[]}
      reviewFormData={reviewFormData}
      reviewChange={() => {}}
      reviewFormErrors={{}}
      addReview={() => {}}
    />
  );

  expect(document.querySelector('.review-list')).not.toBeInTheDocument();
});
