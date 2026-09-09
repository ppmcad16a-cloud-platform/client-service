import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import AddCategory from 'app/components/Manager/AddCategory';

const categoryFormData = { name: '', description: '', products: [], isActive: true };
const products = [{ value: 'p1', label: 'Widget' }];

it('renders every field and reports changes', () => {
  const handleChange = vi.fn();
  const { container } = render(
    <AddCategory
      products={products}
      categoryFormData={categoryFormData}
      formErrors={{}}
      categoryChange={handleChange}
      addCategory={() => {}}
    />
  );

  fireEvent.change(screen.getByPlaceholderText('Category Name'), { target: { value: 'Gadgets' } });
  expect(handleChange).toHaveBeenCalledWith('name', 'Gadgets');

  fireEvent.change(screen.getByPlaceholderText('Category Description'), { target: { value: 'Tech stuff' } });
  expect(handleChange).toHaveBeenCalledWith('description', 'Tech stuff');

  fireEvent.mouseDown(container.querySelector('.react-select__control'), { button: 0 });
  fireEvent.click(screen.getByText('Widget'));
  expect(handleChange).toHaveBeenCalledWith('products', [products[0]]);

  fireEvent.click(screen.getByRole('checkbox'));
  expect(handleChange).toHaveBeenCalledWith('isActive', false);
});

it('shows field-level validation errors', () => {
  render(
    <AddCategory
      products={products}
      categoryFormData={categoryFormData}
      formErrors={{ name: ['Name is required.'] }}
      categoryChange={() => {}}
      addCategory={() => {}}
    />
  );

  expect(screen.getByText('Name is required.')).toBeInTheDocument();
});

it('submits without a full page reload', () => {
  const handleSubmit = vi.fn();
  const { container } = render(
    <AddCategory
      products={products}
      categoryFormData={categoryFormData}
      formErrors={{}}
      categoryChange={() => {}}
      addCategory={handleSubmit}
    />
  );

  fireEvent.submit(container.querySelector('form'));
  expect(handleSubmit).toHaveBeenCalledTimes(1);
});
