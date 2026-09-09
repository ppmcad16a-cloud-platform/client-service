import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import AddAddress from 'app/components/Manager/AddAddress';

const addressFormData = {
  address: '',
  city: '',
  state: '',
  country: '',
  zipCode: '',
  isDefault: false
};

it('renders every field and reports changes', () => {
  const handleChange = vi.fn();
  render(
    <AddAddress addressFormData={addressFormData} formErrors={{}} addressChange={handleChange} addAddress={() => {}} />
  );

  fireEvent.change(screen.getByPlaceholderText('Address: Street, House No / Apartment No'), {
    target: { value: '123 Main St' }
  });
  expect(handleChange).toHaveBeenCalledWith('address', '123 Main St');

  fireEvent.change(screen.getByPlaceholderText('City'), { target: { value: 'Springfield' } });
  expect(handleChange).toHaveBeenCalledWith('city', 'Springfield');

  fireEvent.change(screen.getByPlaceholderText('State'), { target: { value: 'IL' } });
  expect(handleChange).toHaveBeenCalledWith('state', 'IL');

  fireEvent.change(screen.getByPlaceholderText('Please Enter Your country'), { target: { value: 'US' } });
  expect(handleChange).toHaveBeenCalledWith('country', 'US');

  fireEvent.change(screen.getByPlaceholderText('Please Enter Your Zipcode'), { target: { value: '00000' } });
  expect(handleChange).toHaveBeenCalledWith('zipCode', '00000');

  fireEvent.click(screen.getByRole('checkbox'));
  expect(handleChange).toHaveBeenCalledWith('isDefault', true);
});

it('shows field-level validation errors', () => {
  render(
    <AddAddress
      addressFormData={addressFormData}
      formErrors={{ address: ['Address is required.'] }}
      addressChange={() => {}}
      addAddress={() => {}}
    />
  );

  expect(screen.getByText('Address is required.')).toBeInTheDocument();
});

it('submits without a full page reload', () => {
  const handleSubmit = vi.fn();
  const { container } = render(
    <AddAddress addressFormData={addressFormData} formErrors={{}} addressChange={() => {}} addAddress={handleSubmit} />
  );

  fireEvent.submit(container.querySelector('form'));
  expect(handleSubmit).toHaveBeenCalledTimes(1);
});
