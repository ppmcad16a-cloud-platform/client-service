import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import AddMerchant from 'app/components/Manager/AddMerchant';

const merchantFormData = { name: '', email: '', phoneNumber: '', brand: '', business: '' };

it('renders every field and reports changes', () => {
  const handleChange = vi.fn();
  render(
    <AddMerchant merchantFormData={merchantFormData} formErrors={{}} merchantChange={handleChange} addMerchant={() => {}} />
  );

  fireEvent.change(screen.getByPlaceholderText('Your Full Name'), { target: { value: 'Jane' } });
  expect(handleChange).toHaveBeenCalledWith('name', 'Jane');

  fireEvent.change(screen.getByPlaceholderText('Your Email Address'), { target: { value: 'jane@example.com' } });
  expect(handleChange).toHaveBeenCalledWith('email', 'jane@example.com');

  fireEvent.change(screen.getByPlaceholderText('Your Phone Number'), { target: { value: '1234567890' } });
  expect(handleChange).toHaveBeenCalledWith('phoneNumber', '1234567890');

  fireEvent.change(screen.getByPlaceholderText('Your Business Brand'), { target: { value: 'Acme' } });
  expect(handleChange).toHaveBeenCalledWith('brandName', 'Acme');

  fireEvent.change(screen.getByPlaceholderText('Please Describe Your Business'), { target: { value: 'We sell things' } });
  expect(handleChange).toHaveBeenCalledWith('business', 'We sell things');
});

it('shows field-level validation errors', () => {
  render(
    <AddMerchant
      merchantFormData={merchantFormData}
      formErrors={{ email: ['Email is required.'] }}
      merchantChange={() => {}}
      addMerchant={() => {}}
    />
  );

  expect(screen.getByText('Email is required.')).toBeInTheDocument();
});

it('defaults the submit button text to "Submit" and enables it', () => {
  render(
    <AddMerchant merchantFormData={merchantFormData} formErrors={{}} merchantChange={() => {}} addMerchant={() => {}} />
  );

  expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled();
});

it('accepts a custom submit title and disables the button while submitting', () => {
  render(
    <AddMerchant
      merchantFormData={merchantFormData}
      formErrors={{}}
      isSubmitting
      submitTitle='Apply Now'
      merchantChange={() => {}}
      addMerchant={() => {}}
    />
  );

  expect(screen.getByRole('button', { name: 'Apply Now' })).toBeDisabled();
});

it('submits without a full page reload', () => {
  const handleSubmit = vi.fn();
  const { container } = render(
    <AddMerchant merchantFormData={merchantFormData} formErrors={{}} merchantChange={() => {}} addMerchant={handleSubmit} />
  );

  fireEvent.submit(container.querySelector('form'));
  expect(handleSubmit).toHaveBeenCalledTimes(1);
});
