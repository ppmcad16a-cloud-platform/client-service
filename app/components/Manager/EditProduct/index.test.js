import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import EditProduct from 'app/components/Manager/EditProduct';
import { ROLES } from 'app/constants';

const product = {
  _id: '1',
  name: 'Widget',
  sku: 'ABC-1',
  slug: 'widget',
  description: 'A fine widget',
  imageUrl: '',
  quantity: '10',
  price: '9.99',
  taxable: true,
  brand: { value: 'b1', label: 'Acme' },
  isActive: true
};

const brands = [{ value: 'b1', label: 'Acme' }, { value: 'b2', label: 'Globex' }];

const renderIt = overrides =>
  render(
    <EditProduct
      user={{ role: ROLES.Admin }}
      product={product}
      productChange={() => {}}
      formErrors={{}}
      brands={brands}
      updateProduct={() => {}}
      deleteProduct={() => {}}
      activateProduct={() => {}}
      {...overrides}
    />,
    { wrapper: MemoryRouter }
  );

it('renders the product link and fields pre-filled, reporting changes', () => {
  const handleChange = vi.fn();
  renderIt({ productChange: handleChange });

  expect(screen.getByText('widget')).toHaveAttribute('href', '/product/widget');

  fireEvent.change(screen.getByDisplayValue('Widget'), { target: { value: 'Widget 2' } });
  expect(handleChange).toHaveBeenCalledWith('name', 'Widget 2');

  fireEvent.change(screen.getByDisplayValue('ABC-1'), { target: { value: 'ABC-2' } });
  expect(handleChange).toHaveBeenCalledWith('sku', 'ABC-2');

  fireEvent.change(screen.getByDisplayValue('widget'), { target: { value: 'widget-2' } });
  expect(handleChange).toHaveBeenCalledWith('slug', 'widget-2');

  fireEvent.change(screen.getByDisplayValue('A fine widget'), { target: { value: 'An even finer widget' } });
  expect(handleChange).toHaveBeenCalledWith('description', 'An even finer widget');

  fireEvent.change(screen.getByPlaceholderText('https://example.com/product-photo.jpg'), {
    target: { value: 'http://example.com/x.png' }
  });
  expect(handleChange).toHaveBeenCalledWith('imageUrl', 'http://example.com/x.png');

  fireEvent.input(screen.getByPlaceholderText('Product Quantity'), { target: { value: '20' } });
  expect(handleChange).toHaveBeenCalledWith('quantity', '20');

  fireEvent.input(screen.getByPlaceholderText('Product Price'), { target: { value: '19.99' } });
  expect(handleChange).toHaveBeenCalledWith('price', '19.99');
});

it('reports a new taxable selection using its raw value', () => {
  const handleChange = vi.fn();
  const { container } = renderIt({ productChange: handleChange });

  const selects = container.querySelectorAll('.react-select__control');
  fireEvent.mouseDown(selects[0], { button: 0 }); // Taxable
  fireEvent.click(screen.getByText('No'));
  expect(handleChange).toHaveBeenCalledWith('taxable', 0);
});

it('shows the brand select for an admin and reports brand changes', () => {
  const handleChange = vi.fn();
  const { container } = renderIt({ productChange: handleChange, user: { role: ROLES.Admin } });

  expect(screen.getByText('Select Brand')).toBeInTheDocument();

  const selects = container.querySelectorAll('.react-select__control');
  fireEvent.mouseDown(selects[1], { button: 0 }); // Brand
  fireEvent.click(screen.getByText('Globex'));
  expect(handleChange).toHaveBeenCalledWith('brand', brands[1]);
});

it('hides the brand select for a merchant', () => {
  renderIt({ user: { role: ROLES.Merchant } });

  expect(screen.queryByText('Select Brand')).not.toBeInTheDocument();
});

it('reports both a form change and an immediate activation when the Active switch is toggled', () => {
  const handleChange = vi.fn();
  const handleActivate = vi.fn();
  renderIt({ productChange: handleChange, activateProduct: handleActivate });

  fireEvent.click(screen.getByRole('checkbox'));
  expect(handleChange).toHaveBeenCalledWith('isActive', false);
  expect(handleActivate).toHaveBeenCalledWith('1', false);
});

it('shows field-level validation errors', () => {
  renderIt({ formErrors: { name: ['Name is required.'] } });

  expect(screen.getByText('Name is required.')).toBeInTheDocument();
});

it('submits (Save) without a full page reload and calls updateProduct', () => {
  const handleUpdate = vi.fn();
  const { container } = renderIt({ updateProduct: handleUpdate });

  fireEvent.submit(container.querySelector('form'));
  expect(handleUpdate).toHaveBeenCalledTimes(1);
});

it('calls deleteProduct with the product id when Delete is clicked', () => {
  const handleDelete = vi.fn();
  renderIt({ deleteProduct: handleDelete });

  fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
  expect(handleDelete).toHaveBeenCalledWith('1');
});
