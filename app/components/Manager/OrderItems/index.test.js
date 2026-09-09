import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import OrderItems from 'app/components/Manager/OrderItems';
import { ROLES, CART_ITEM_STATUS } from 'app/constants';

const renderIt = (products, user = { role: ROLES.Member }, updateOrderItemStatus = () => {}) =>
  render(
    <OrderItems order={{ products }} user={user} updateOrderItemStatus={updateOrderItemStatus} />,
    { wrapper: MemoryRouter }
  );

it('links to the review page for a delivered item', () => {
  const products = [
    { _id: '1', status: CART_ITEM_STATUS.Delivered, quantity: 1, totalPrice: 10, product: { slug: 'widget', name: 'Widget', price: 10 } }
  ];
  renderIt(products);

  expect(screen.getByText('Reivew Product')).toHaveAttribute('href', '/product/widget');
});

it('shows a confirm-cancel action for a non-admin on a non-cancelled item', () => {
  const updateOrderItemStatus = vi.fn();
  const products = [
    { _id: '1', status: CART_ITEM_STATUS.Processing, quantity: 1, totalPrice: 10, product: { slug: 'widget', name: 'Widget', price: 10 } }
  ];
  renderIt(products, { role: ROLES.Member }, updateOrderItemStatus);

  // DropdownConfirm's menu content carries aria-hidden="true" while closed,
  // which excludes it (and its "Confirm Cancel" button) from getByRole's
  // accessible-roles tree — getByText isn't affected by aria-hidden, so it
  // finds the button's label regardless of the dropdown's open state.
  fireEvent.click(screen.getByText('Confirm Cancel'));
  expect(updateOrderItemStatus).toHaveBeenCalledWith('1', 'Cancelled');
});

it("shows the admin's full status-change dropdown for a non-cancelled item", () => {
  const updateOrderItemStatus = vi.fn();
  const products = [
    { _id: '1', status: CART_ITEM_STATUS.Processing, quantity: 1, totalPrice: 10, product: { slug: 'widget', name: 'Widget', price: 10 } }
  ];
  renderIt(products, { role: ROLES.Admin }, updateOrderItemStatus);

  fireEvent.click(screen.getByText(CART_ITEM_STATUS.Shipped));
  expect(updateOrderItemStatus).toHaveBeenCalledWith('1', CART_ITEM_STATUS.Shipped);
});

it('renders no action for a cancelled item', () => {
  const products = [
    { _id: '1', status: 'Cancelled', quantity: 1, totalPrice: 10, product: { slug: 'widget', name: 'Widget', price: 10 } }
  ];
  renderIt(products);

  expect(screen.queryByRole('button', { name: 'Confirm Cancel' })).not.toBeInTheDocument();
});

it('falls back to the product price when purchasePrice is unset, and shows "Not Available" when the product is gone', () => {
  const products = [
    { _id: '1', status: CART_ITEM_STATUS.Processing, quantity: 2, totalPrice: 20, product: { slug: 'widget', name: 'Widget', price: 10 } },
    { _id: '2', status: CART_ITEM_STATUS.Processing, quantity: 1, totalPrice: 5, product: null }
  ];
  const { container } = renderIt(products);

  expect(container.querySelector('.price')).toHaveTextContent('$10');
  expect(screen.getByText('Not Available')).toBeInTheDocument();
});

it('uses purchasePrice over the product price when set', () => {
  const products = [
    { _id: '1', status: CART_ITEM_STATUS.Processing, purchasePrice: 8, quantity: 1, totalPrice: 8, product: { slug: 'widget', name: 'Widget', price: 10 } }
  ];
  const { container } = renderIt(products);

  expect(container.querySelector('.price')).toHaveTextContent('$8');
});
