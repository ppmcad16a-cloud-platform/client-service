import React from 'react';
import { render, screen } from '@testing-library/react';

import Badge from 'app/components/Common/Badge';

it('renders children with the default (secondary) variant and rounded corners', () => {
  render(<Badge>Active</Badge>);

  const badge = screen.getByText('Active');
  expect(badge).toHaveClass('custom-badge-secondary');
  expect(badge).toHaveStyle({ borderRadius: 3 });
});

it('applies a named variant and custom className', () => {
  render(
    <Badge variant='danger' className='my-badge'>
      Inactive
    </Badge>
  );

  const badge = screen.getByText('Inactive');
  expect(badge).toHaveClass('custom-badge-danger');
  expect(badge).toHaveClass('my-badge');
});

it('flattens the border radius to 0 when borderless is set', () => {
  render(<Badge borderless>Flat</Badge>);

  expect(screen.getByText('Flat')).toHaveStyle({ borderRadius: 0 });
});

it('renders no variant class when variant is falsy', () => {
  render(<Badge variant={null}>None</Badge>);

  const badge = screen.getByText('None');
  expect(badge.className.trim()).toBe('custom-badge');
});
