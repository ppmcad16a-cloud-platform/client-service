import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import EditCategory from 'app/components/Manager/EditCategory';

const category = { _id: '1', name: 'Gadgets', slug: 'gadgets', description: 'Tech stuff', isActive: true, products: [] };
const products = [{ value: 'p1', label: 'Widget' }];

const renderIt = overrides =>
  render(
    <EditCategory
      products={products}
      category={category}
      categoryChange={() => {}}
      formErrors={{}}
      updateCategory={() => {}}
      deleteCategory={() => {}}
      activateCategory={() => {}}
      {...overrides}
    />,
    { wrapper: MemoryRouter }
  );

it('renders the category link and fields pre-filled, reporting changes', () => {
  const handleChange = vi.fn();
  renderIt({ categoryChange: handleChange });

  expect(screen.getByText('gadgets')).toHaveAttribute('href', '/shop/category/gadgets');

  fireEvent.change(screen.getByDisplayValue('Gadgets'), { target: { value: 'Gizmos' } });
  expect(handleChange).toHaveBeenCalledWith('name', 'Gizmos');

  fireEvent.change(screen.getByDisplayValue('gadgets'), { target: { value: 'gizmos' } });
  expect(handleChange).toHaveBeenCalledWith('slug', 'gizmos');

  fireEvent.change(screen.getByDisplayValue('Tech stuff'), { target: { value: 'Tech and gizmos' } });
  expect(handleChange).toHaveBeenCalledWith('description', 'Tech and gizmos');
});

it('reports selected products', () => {
  const handleChange = vi.fn();
  const { container } = renderIt({ categoryChange: handleChange });

  fireEvent.mouseDown(container.querySelector('.react-select__control'), { button: 0 });
  fireEvent.click(screen.getByText('Widget'));
  expect(handleChange).toHaveBeenCalledWith('products', [products[0]]);
});

it('calls activateCategory with the category id and new value when the switch is toggled', () => {
  const handleActivate = vi.fn();
  renderIt({ activateCategory: handleActivate });

  fireEvent.click(screen.getByRole('checkbox'));
  expect(handleActivate).toHaveBeenCalledWith('1', false);
});

it('shows field-level validation errors', () => {
  renderIt({ formErrors: { name: ['Name is required.'] } });

  expect(screen.getByText('Name is required.')).toBeInTheDocument();
});

it('submits (Save) without a full page reload and calls updateCategory', () => {
  const handleUpdate = vi.fn();
  const { container } = renderIt({ updateCategory: handleUpdate });

  fireEvent.submit(container.querySelector('form'));
  expect(handleUpdate).toHaveBeenCalledTimes(1);
});

it('calls deleteCategory with the category id when Delete is clicked', () => {
  const handleDelete = vi.fn();
  renderIt({ deleteCategory: handleDelete });

  fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
  expect(handleDelete).toHaveBeenCalledWith('1');
});
