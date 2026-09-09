import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import AccountDetails from 'app/components/Manager/AccountDetails';

const user = { email: 'jane@example.com', role: 'ROLE MEMBER', firstName: 'Jane', lastName: 'Doe', phoneNumber: '123' };

it('renders the user email, role, and profile fields', () => {
  render(<AccountDetails user={user} accountChange={() => {}} updateProfile={() => {}} />);

  expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  expect(screen.getByDisplayValue('Jane')).toBeInTheDocument();
  expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
  expect(screen.getByDisplayValue('123')).toBeInTheDocument();
});

it('falls back to empty strings when name/phone fields are unset', () => {
  render(
    <AccountDetails
      user={{ email: 'jane@example.com', role: 'ROLE MEMBER' }}
      accountChange={() => {}}
      updateProfile={() => {}}
    />
  );

  expect(screen.getByPlaceholderText('Please Enter Your First Name')).toHaveValue('');
  expect(screen.getByPlaceholderText('Please Enter Your Last Name')).toHaveValue('');
  expect(screen.getByPlaceholderText('Please Enter Your Phone Number')).toHaveValue('');
});

it('reports field changes and submits the profile update', () => {
  const handleChange = vi.fn();
  const handleSubmit = vi.fn();
  const { container } = render(
    <AccountDetails user={user} accountChange={handleChange} updateProfile={handleSubmit} />
  );

  fireEvent.change(screen.getByDisplayValue('Jane'), { target: { value: 'Janet' } });
  expect(handleChange).toHaveBeenCalledWith('firstName', 'Janet');

  fireEvent.change(screen.getByDisplayValue('Doe'), { target: { value: 'Smith' } });
  expect(handleChange).toHaveBeenCalledWith('lastName', 'Smith');

  fireEvent.change(screen.getByDisplayValue('123'), { target: { value: '456' } });
  expect(handleChange).toHaveBeenCalledWith('phoneNumber', '456');

  fireEvent.submit(container.querySelector('form'));
  expect(handleSubmit).toHaveBeenCalledTimes(1);
});
