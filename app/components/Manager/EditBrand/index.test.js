import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import EditBrand from 'app/components/Manager/EditBrand';
import { ROLES } from 'app/constants';

const brand = { _id: '1', name: 'Acme', slug: 'acme', description: 'Fine goods', isActive: true };

it('renders the brand link, fields pre-filled, and reports changes', () => {
  const handleChange = vi.fn();
  render(
    <EditBrand
      user={{ role: ROLES.Admin }}
      brand={brand}
      brandChange={handleChange}
      formErrors={{}}
      updateBrand={() => {}}
      deleteBrand={() => {}}
      activateBrand={() => {}}
    />,
    { wrapper: MemoryRouter }
  );

  expect(screen.getByText('acme')).toHaveAttribute('href', '/shop/brand/acme');

  fireEvent.change(screen.getByDisplayValue('Acme'), { target: { value: 'Acme Co' } });
  expect(handleChange).toHaveBeenCalledWith('name', 'Acme Co');

  fireEvent.change(screen.getByDisplayValue('acme'), { target: { value: 'acme-co' } });
  expect(handleChange).toHaveBeenCalledWith('slug', 'acme-co');

  fireEvent.change(screen.getByDisplayValue('Fine goods'), { target: { value: 'Even finer goods' } });
  expect(handleChange).toHaveBeenCalledWith('description', 'Even finer goods');
});

it('shows a tooltip warning about cascading product deactivation while active', () => {
  render(
    <EditBrand
      user={{ role: ROLES.Admin }}
      brand={brand}
      brandChange={() => {}}
      formErrors={{}}
      updateBrand={() => {}}
      deleteBrand={() => {}}
      activateBrand={() => {}}
    />,
    { wrapper: MemoryRouter }
  );

  expect(document.getElementById(`tooltip-enable-brand-${brand._id}`)).toBeInTheDocument();
});

it('calls activateBrand with the brand id and new value when the switch is toggled', () => {
  const handleActivate = vi.fn();
  render(
    <EditBrand
      user={{ role: ROLES.Admin }}
      brand={brand}
      brandChange={() => {}}
      formErrors={{}}
      updateBrand={() => {}}
      deleteBrand={() => {}}
      activateBrand={handleActivate}
    />,
    { wrapper: MemoryRouter }
  );

  fireEvent.click(screen.getByRole('checkbox'));
  expect(handleActivate).toHaveBeenCalledWith('1', false);
});

it('shows field-level validation errors', () => {
  render(
    <EditBrand
      user={{ role: ROLES.Admin }}
      brand={brand}
      brandChange={() => {}}
      formErrors={{ name: ['Name is required.'] }}
      updateBrand={() => {}}
      deleteBrand={() => {}}
      activateBrand={() => {}}
    />,
    { wrapper: MemoryRouter }
  );

  expect(screen.getByText('Name is required.')).toBeInTheDocument();
});

it('submits (Save) without a full page reload and calls updateBrand', () => {
  const handleUpdate = vi.fn();
  const { container } = render(
    <EditBrand
      user={{ role: ROLES.Admin }}
      brand={brand}
      brandChange={() => {}}
      formErrors={{}}
      updateBrand={handleUpdate}
      deleteBrand={() => {}}
      activateBrand={() => {}}
    />,
    { wrapper: MemoryRouter }
  );

  fireEvent.submit(container.querySelector('form'));
  expect(handleUpdate).toHaveBeenCalledTimes(1);
});

it('enables Delete for an admin and calls deleteBrand with the brand id', () => {
  const handleDelete = vi.fn();
  render(
    <EditBrand
      user={{ role: ROLES.Admin }}
      brand={brand}
      brandChange={() => {}}
      formErrors={{}}
      updateBrand={() => {}}
      deleteBrand={handleDelete}
      activateBrand={() => {}}
    />,
    { wrapper: MemoryRouter }
  );

  const deleteButton = screen.getByRole('button', { name: 'Delete' });
  expect(deleteButton).toBeEnabled();
  fireEvent.click(deleteButton);
  expect(handleDelete).toHaveBeenCalledWith('1');
});

it('disables Delete for a merchant', () => {
  render(
    <EditBrand
      user={{ role: ROLES.Merchant }}
      brand={brand}
      brandChange={() => {}}
      formErrors={{}}
      updateBrand={() => {}}
      deleteBrand={() => {}}
      activateBrand={() => {}}
    />,
    { wrapper: MemoryRouter }
  );

  expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled();
});
