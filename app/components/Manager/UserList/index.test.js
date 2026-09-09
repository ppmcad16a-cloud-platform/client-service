import React from 'react';
import { render, screen } from '@testing-library/react';

import UserList from 'app/components/Manager/UserList';
import { ROLES } from 'app/constants';

it('renders full name, email, provider, and role for a complete user', () => {
  const users = [
    {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      provider: 'email',
      created: '2024-01-01T00:00:00.000Z',
      role: ROLES.Admin
    }
  ];

  render(<UserList users={users} />);

  expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  expect(screen.getByText('email')).toBeInTheDocument();
  expect(screen.getByText('Admin')).toBeInTheDocument();
});

it('falls back to N/A for the name and - for the email when unset', () => {
  const users = [{ role: ROLES.Member }];

  render(<UserList users={users} />);

  expect(screen.getByText('N/A')).toBeInTheDocument();
  expect(screen.getByText('-')).toBeInTheDocument();
});
