import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import AddProduct from 'app/components/Manager/AddProduct';
import { ROLES } from 'app/constants';

const productFormData = {
  sku: '',
  name: '',
  description: '',
  imageUrl: '',
  quantity: '',
  price: '',
  taxable: null,
  brand: null,
  isActive: true
};

const brands = [
  { value: 0, label: 'No option selected' },
  { value: 'b1', label: 'Acme' }
];

const taxableSelect = [
  { value: 1, label: 'Yes' },
  { value: 0, label: 'No' }
];

it('renders every field and reports changes for an admin, with brand freely selectable', () => {
  const handleChange = vi.fn();
  const { container } = render(
    <AddProduct
      user={{ role: ROLES.Admin }}
      productFormData={productFormData}
      formErrors={{}}
      productChange={handleChange}
      addProduct={() => {}}
      brands={brands}
    />
  );

  fireEvent.change(screen.getByPlaceholderText('Product Sku'), { target: { value: 'ABC-1' } });
  expect(handleChange).toHaveBeenCalledWith('sku', 'ABC-1');

  fireEvent.change(screen.getByPlaceholderText('Product Name'), { target: { value: 'Widget' } });
  expect(handleChange).toHaveBeenCalledWith('name', 'Widget');

  fireEvent.change(screen.getByPlaceholderText('Product Description'), { target: { value: 'A fine widget' } });
  expect(handleChange).toHaveBeenCalledWith('description', 'A fine widget');

  fireEvent.change(screen.getByPlaceholderText('https://example.com/product-photo.jpg'), {
    target: { value: 'http://example.com/x.png' }
  });
  expect(handleChange).toHaveBeenCalledWith('imageUrl', 'http://example.com/x.png');

  fireEvent.input(screen.getByPlaceholderText('Product Quantity'), { target: { value: '10' } });
  expect(handleChange).toHaveBeenCalledWith('quantity', '10');

  fireEvent.input(screen.getByPlaceholderText('Product Price'), { target: { value: '9.99' } });
  expect(handleChange).toHaveBeenCalledWith('price', '9.99');

  const selects = container.querySelectorAll('.react-select__control');
  fireEvent.mouseDown(selects[0], { button: 0 }); // Taxable
  fireEvent.click(screen.getByText('Yes'));
  expect(handleChange).toHaveBeenCalledWith('taxable', taxableSelect[0]);

  fireEvent.mouseDown(selects[1], { button: 0 }); // Brand
  fireEvent.click(screen.getByText('Acme'));
  expect(handleChange).toHaveBeenCalledWith('brand', brands[1]);

  fireEvent.click(screen.getByRole('checkbox'));
  expect(handleChange).toHaveBeenCalledWith('isActive', false);

  expect(container.querySelector('.react-select__control--is-disabled')).not.toBeInTheDocument();
});

it("locks the brand select to the merchant's own brand and disables it for a merchant", () => {
  const { container } = render(
    <AddProduct
      user={{ role: ROLES.Merchant }}
      productFormData={productFormData}
      formErrors={{}}
      productChange={() => {}}
      addProduct={() => {}}
      brands={brands}
    />
  );

  expect(container.querySelector('.react-select__control--is-disabled')).toBeInTheDocument();
  expect(screen.getByText('Acme')).toBeInTheDocument();
});

it('shows field-level validation errors', () => {
  render(
    <AddProduct
      user={{ role: ROLES.Admin }}
      productFormData={productFormData}
      formErrors={{ sku: ['Sku is required.'] }}
      productChange={() => {}}
      addProduct={() => {}}
      brands={brands}
    />
  );

  expect(screen.getByText('Sku is required.')).toBeInTheDocument();
});

it('submits without a full page reload', () => {
  const handleSubmit = vi.fn();
  const { container } = render(
    <AddProduct
      user={{ role: ROLES.Admin }}
      productFormData={productFormData}
      formErrors={{}}
      productChange={() => {}}
      addProduct={handleSubmit}
      brands={brands}
    />
  );

  fireEvent.submit(container.querySelector('form'));
  expect(handleSubmit).toHaveBeenCalledTimes(1);
});
