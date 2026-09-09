import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import ResetPasswordForm from 'app/components/Common/ResetPasswordForm';

const resetFormData = { password: '', confirmPassword: '' };

it('renders a "Password" placeholder when isToken is set', () => {
  render(
    <ResetPasswordForm
      resetFormData={resetFormData}
      formErrors={{}}
      isToken
      resetPasswordChange={() => {}}
      resetPassword={() => {}}
    />
  );

  expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
});

it('renders an "Old Password" placeholder when isToken is not set', () => {
  render(
    <ResetPasswordForm
      resetFormData={resetFormData}
      formErrors={{}}
      isToken={false}
      resetPasswordChange={() => {}}
      resetPassword={() => {}}
    />
  );

  expect(screen.getByPlaceholderText('Old Password')).toBeInTheDocument();
});

it('reports password and confirmPassword field changes', () => {
  const handleChange = vi.fn();
  render(
    <ResetPasswordForm
      resetFormData={resetFormData}
      formErrors={{}}
      isToken
      resetPasswordChange={handleChange}
      resetPassword={() => {}}
    />
  );

  fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'secret1' } });
  expect(handleChange).toHaveBeenCalledWith('password', 'secret1');

  fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'secret1' } });
  expect(handleChange).toHaveBeenCalledWith('confirmPassword', 'secret1');
});

it('shows field-level validation errors', () => {
  render(
    <ResetPasswordForm
      resetFormData={resetFormData}
      formErrors={{ password: ['Password is required.'], confirmPassword: ['Passwords must match.'] }}
      isToken
      resetPasswordChange={() => {}}
      resetPassword={() => {}}
    />
  );

  expect(screen.getByText('Password is required.')).toBeInTheDocument();
  expect(screen.getByText('Passwords must match.')).toBeInTheDocument();
});

it('submits the form without a full page reload and calls resetPassword', () => {
  const handleSubmit = vi.fn();
  const { container } = render(
    <ResetPasswordForm
      resetFormData={resetFormData}
      formErrors={{}}
      isToken
      resetPasswordChange={() => {}}
      resetPassword={handleSubmit}
    />
  );

  fireEvent.submit(container.querySelector('form'));
  expect(handleSubmit).toHaveBeenCalledTimes(1);
});
