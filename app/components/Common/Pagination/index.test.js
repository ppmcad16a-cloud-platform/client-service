import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import Pagination from 'app/components/Common/Pagination';

it('renders page links for the given total and reports a 1-indexed page on click', () => {
  const handlePagination = vi.fn();
  render(<Pagination totalPages={5} onPagination={handlePagination} />);

  // react-paginate's `selected` is 0-indexed; clicking the "2" link should
  // report page 2 (1-indexed) via the 'pagination' filter name.
  fireEvent.click(screen.getByText('2'));

  expect(handlePagination).toHaveBeenCalledWith('pagination', 2);
});

it('renders nothing when totalPages is 0', () => {
  const { container } = render(<Pagination totalPages={0} onPagination={() => {}} />);

  expect(container.querySelector('.pagination')).not.toBeInTheDocument();
});
