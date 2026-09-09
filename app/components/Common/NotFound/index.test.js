import React from 'react';
import { render, screen } from '@testing-library/react';

import NotFound from 'app/components/Common/NotFound';

it('renders the message prop when given one', () => {
  render(<NotFound message='No results' />);

  expect(screen.getByText('No results')).toBeInTheDocument();
});

it('falls back to children when there is no message', () => {
  render(<NotFound>Nothing here</NotFound>);

  expect(screen.getByText('Nothing here')).toBeInTheDocument();
});

it('applies a custom className alongside the default', () => {
  render(<NotFound className='extra'>Empty</NotFound>);

  expect(screen.getByText('Empty')).toHaveClass('not-found', 'extra');
});
