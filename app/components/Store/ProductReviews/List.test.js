import React from 'react';
import { render, screen } from '@testing-library/react';

import List from 'app/components/Store/ProductReviews/List';

it("renders each review with the reviewer's initial avatar, title, and rating", () => {
  const reviews = [
    { title: 'Great!', review: 'Loved it', rating: 5, created: '2024-01-01T00:00:00.000Z', user: { firstName: 'Jane' } }
  ];

  render(<List reviews={reviews} />);

  expect(screen.getByText('Great!')).toBeInTheDocument();
  expect(screen.getByText('Loved it')).toBeInTheDocument();
  expect(screen.getByText('J')).toBeInTheDocument();
});

it('shows no avatar when the reviewer has no firstName', () => {
  const reviews = [
    { title: 'Great!', review: 'Loved it', rating: 5, created: '2024-01-01T00:00:00.000Z', user: {} }
  ];

  const { container } = render(<List reviews={reviews} />);

  expect(container.querySelector('.avatar')).not.toBeInTheDocument();
});

it('renders nothing when there are no reviews', () => {
  const { container } = render(<List reviews={[]} />);

  expect(container.querySelector('.review-list').children).toHaveLength(0);
});
