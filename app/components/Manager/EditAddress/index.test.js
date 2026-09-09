import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import EditAddress from 'app/components/Manager/EditAddress';

const address = {
  _id: '1',
  address: '123 Main St',
  city: 'Springfield',
  state: 'IL',
  country: 'US',
  zipCode: '00000',
  isDefault: false
};

it('renders every field pre-filled and reports changes', () => {
  const handleChange = vi.fn();
  render(<EditAddress address={address} addressChange={handleChange} formErrors={{}} updateAddress={() => {}} deleteAddress={() => {}} />);

  fireEvent.change(screen.getByDisplayValue('123 Main St'), { target: { value: '456 Oak Ave' } });
  expect(handleChange).toHaveBeenCalledWith('address', '456 Oak Ave');

  fireEvent.change(screen.getByDisplayValue('Springfield'), { target: { value: 'Shelbyville' } });
  expect(handleChange).toHaveBeenCalledWith('city', 'Shelbyville');

  fireEvent.change(screen.getByDisplayValue('IL'), { target: { value: 'CA' } });
  expect(handleChange).toHaveBeenCalledWith('state', 'CA');

  fireEvent.change(screen.getByDisplayValue('US'), { target: { value: 'CA-country' } });
  expect(handleChange).toHaveBeenCalledWith('country', 'CA-country');

  fireEvent.change(screen.getByDisplayValue('00000'), { target: { value: '99999' } });
  expect(handleChange).toHaveBeenCalledWith('zipCode', '99999');

  fireEvent.click(screen.getByRole('checkbox'));
  expect(handleChange).toHaveBeenCalledWith('isDefault', true);
});

it('shows field-level validation errors', () => {
  render(
    <EditAddress
      address={address}
      addressChange={() => {}}
      formErrors={{ address: ['Address is required.'] }}
      updateAddress={() => {}}
      deleteAddress={() => {}}
    />
  );

  expect(screen.getByText('Address is required.')).toBeInTheDocument();
});

it('submits (Save) without a full page reload and calls updateAddress', () => {
  const handleUpdate = vi.fn();
  const { container } = render(
    <EditAddress address={address} addressChange={() => {}} formErrors={{}} updateAddress={handleUpdate} deleteAddress={() => {}} />
  );

  fireEvent.submit(container.querySelector('form'));
  expect(handleUpdate).toHaveBeenCalledTimes(1);
});

it('calls deleteAddress with the address id when Delete is clicked', () => {
  const handleDelete = vi.fn();
  render(<EditAddress address={address} addressChange={() => {}} formErrors={{}} updateAddress={() => {}} deleteAddress={handleDelete} />);

  fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
  expect(handleDelete).toHaveBeenCalledWith('1');
});
