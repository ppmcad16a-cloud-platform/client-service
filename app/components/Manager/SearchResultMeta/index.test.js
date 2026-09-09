import React from 'react';
import { render, screen } from '@testing-library/react';

import SearchResultMeta from 'app/components/Manager/SearchResultMeta';

it('renders the count and label together', () => {
  render(<SearchResultMeta count={12} label='results' />);

  expect(screen.getByText('12 results')).toBeInTheDocument();
});
