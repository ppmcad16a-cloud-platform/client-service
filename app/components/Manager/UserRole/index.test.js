import React from 'react';
import { render, screen } from '@testing-library/react';

import UserRole from 'app/components/Manager/UserRole';
import { ROLES } from 'app/constants';

it('renders an Admin badge', () => {
  render(<UserRole user={{ role: ROLES.Admin }} />);
  expect(screen.getByText('Admin')).toBeInTheDocument();
});

it('renders a Merchant badge', () => {
  render(<UserRole user={{ role: ROLES.Merchant }} />);
  expect(screen.getByText('Merchant')).toBeInTheDocument();
});

it('falls back to a Member badge for any other role', () => {
  render(<UserRole user={{ role: ROLES.Member }} />);
  expect(screen.getByText('Member')).toBeInTheDocument();
});

it('applies a custom className to the badge', () => {
  render(<UserRole user={{ role: ROLES.Admin }} className='extra' />);
  expect(screen.getByText('Admin')).toHaveClass('extra');
});
