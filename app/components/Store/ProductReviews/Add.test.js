import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import Add from 'app/components/Store/ProductReviews/Add';

const reviewFormData = { title: '', review: '', rating: 0, isRecommended: null };

it('renders every field and reports changes', () => {
  const handleChange = vi.fn();
  render(<Add reviewFormData={reviewFormData} reviewChange={handleChange} reviewFormErrors={{}} addReview={() => {}} />);

  fireEvent.change(screen.getByPlaceholderText('Enter Review title'), { target: { value: 'Great product' } });
  expect(handleChange).toHaveBeenCalledWith('title', 'Great product');

  fireEvent.change(screen.getByPlaceholderText('Write Review'), { target: { value: 'Loved it' } });
  expect(handleChange).toHaveBeenCalledWith('review', 'Loved it');
});

it('reports a star rating selection', () => {
  const handleChange = vi.fn();
  const { container } = render(
    <Add reviewFormData={reviewFormData} reviewChange={handleChange} reviewFormErrors={{}} addReview={() => {}} />
  );

  fireEvent.click(container.querySelector('[data-index="3"]'));
  expect(handleChange).toHaveBeenCalledWith('rating', 4);
});

it('reports a recommendation selection', () => {
  const handleChange = vi.fn();
  const { container } = render(
    <Add reviewFormData={reviewFormData} reviewChange={handleChange} reviewFormErrors={{}} addReview={() => {}} />
  );

  fireEvent.mouseDown(container.querySelector('.react-select__control'), { button: 0 });
  fireEvent.click(screen.getByText('Yes'));
  expect(handleChange).toHaveBeenCalledWith('isRecommended', { value: 1, label: 'Yes' });
});

it('shows field-level validation errors', () => {
  render(
    <Add
      reviewFormData={reviewFormData}
      reviewChange={() => {}}
      reviewFormErrors={{ title: ['Title is required.'] }}
      addReview={() => {}}
    />
  );

  expect(screen.getByText('Title is required.')).toBeInTheDocument();
});

it('submits without a full page reload', () => {
  const handleSubmit = vi.fn();
  const { container } = render(
    <Add reviewFormData={reviewFormData} reviewChange={() => {}} reviewFormErrors={{}} addReview={handleSubmit} />
  );

  fireEvent.submit(container.querySelector('form'));
  expect(handleSubmit).toHaveBeenCalledTimes(1);
});
