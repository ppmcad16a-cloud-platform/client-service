import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import AddBrand from 'app/components/Manager/AddBrand';

const brandFormData = { name: '', description: '', isActive: true };

it('renders every field and reports changes', () => {
  const handleChange = vi.fn();
  render(<AddBrand brandFormData={brandFormData} formErrors={{}} brandChange={handleChange} addBrand={() => {}} />);

  fireEvent.change(screen.getByPlaceholderText('Brand Name'), { target: { value: 'Acme' } });
  expect(handleChange).toHaveBeenCalledWith('name', 'Acme');

  fireEvent.change(screen.getByPlaceholderText('Brand Description'), { target: { value: 'A fine brand' } });
  expect(handleChange).toHaveBeenCalledWith('description', 'A fine brand');

  fireEvent.click(screen.getByRole('checkbox'));
  expect(handleChange).toHaveBeenCalledWith('isActive', false);
});

it('shows field-level validation errors', () => {
  render(
    <AddBrand brandFormData={brandFormData} formErrors={{ name: ['Name is required.'] }} brandChange={() => {}} addBrand={() => {}} />
  );

  expect(screen.getByText('Name is required.')).toBeInTheDocument();
});

it('submits without a full page reload', () => {
  const handleSubmit = vi.fn();
  const { container } = render(
    <AddBrand brandFormData={brandFormData} formErrors={{}} brandChange={() => {}} addBrand={handleSubmit} />
  );

  fireEvent.submit(container.querySelector('form'));
  expect(handleSubmit).toHaveBeenCalledTimes(1);
});
