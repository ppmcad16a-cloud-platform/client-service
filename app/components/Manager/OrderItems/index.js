/**
 *
 * OrderItems
 *
 */

import React from 'react';

import { Link } from 'react-router-dom';
import { Row, Col, DropdownItem } from 'reactstrap';

import { ROLES, CART_ITEM_STATUS } from '../../../constants';
import Button from '../../Common/Button';
import DropdownConfirm from '../../Common/DropdownConfirm';
import ProductImage from '../../Common/ProductImage';

// Line-items list for a single order. Per-item actions differ by role and
// current status (see renderItemsAction): a delivered item offers a
// "review" link; a non-admin can only cancel their own item (with a confirm
// step); an admin instead gets a full status-change dropdown covering every
// CART_ITEM_STATUS value.
const OrderItems = props => {
  const { order, user, updateOrderItemStatus } = props;

  // Builds the admin-only status dropdown's menu items from every possible
  // CART_ITEM_STATUS value, highlighting the item's current one.
  const renderPopoverContent = item => {
    const statuses = Object.values(CART_ITEM_STATUS);

    return (
      <div className='d-flex flex-column align-items-center justify-content-center'>
        {statuses.map((s, i) => (
          <DropdownItem
            key={`${s}-${i}`}
            className={s === item?.status ? 'active' : ''}
            onClick={() => updateOrderItemStatus(item._id, s)}
          >
            {s}
          </DropdownItem>
        ))}
      </div>
    );
  };

  const renderItemsAction = item => {
    const isAdmin = user.role === ROLES.Admin;

    if (item.status === CART_ITEM_STATUS.Delivered) {
      return (
        <Link
          to={`/product/${item.product.slug}`}
          className='btn-link text-center py-2 fs-12'
          style={{ minWidth: 120 }}
        >
          Reivew Product
        </Link>
      );
    } else if (item.status !== 'Cancelled') {
      // NOTE: compares against the string literal 'Cancelled' here rather
      // than CART_ITEM_STATUS.Cancelled (used everywhere else in this
      // file/app) — same value today, but not kept in sync by the constant.
      if (!isAdmin) {
        return (
          <DropdownConfirm label='Cancel'>
            <div className='d-flex flex-column align-items-center justify-content-center p-2'>
              <p className='text-center mb-2'>{`Are you sure you want to cancel ${item.product?.name}.`}</p>
              <Button
                variant='danger'
                id='CancelOrderItemPopover'
                size='sm'
                text='Confirm Cancel'
                role='menuitem'
                className='cancel-order-btn'
                onClick={() => updateOrderItemStatus(item._id, 'Cancelled')}
              />
            </div>
          </DropdownConfirm>
        );
      } else {
        return (
          <DropdownConfirm
            label={item.product && item.status}
            className={isAdmin ? 'admin' : ''}
          >
            {renderPopoverContent(item)}
          </DropdownConfirm>
        );
      }
    }
  };

  return (
    <div className='order-items pt-3'>
      <h2>Order Items</h2>
      <Row>
        {order.products.map((item, index) => (
          <Col xs='12' key={index} className='item'>
            <div className='order-item-box'>
              <div className='d-flex justify-content-between flex-column flex-md-row'>
                <div className='d-flex align-items-center box'>
                  <ProductImage
                    className='item-image'
                    src={item.product?.imageUrl}
                    alt={item.product?.name}
                  />
                  <div className='d-md-flex flex-1 align-items-start ml-4 item-box'>
                    <div className='item-details'>
                      {item.product ? (
                        <>
                          <Link
                            to={`/product/${item.product?.slug}`}
                            className='item-link'
                          >
                            <h4 className='d-block item-name one-line-ellipsis'>
                              {item.product?.name}
                            </h4>
                          </Link>
                          <div className='d-flex align-items-center justify-content-between'>
                            <span className='price'>
                              ${item.purchasePrice || item.product.price}
                            </span>
                          </div>
                        </>
                      ) : (
                        <h4>Not Available</h4>
                      )}
                    </div>
                    <div className='d-flex justify-content-between flex-wrap d-md-none mt-1'>
                      <p className='mb-1 mr-4'>
                        Status
                        <span className='order-label order-status'>{` ${item.status}`}</span>
                      </p>
                      <p className='mb-1 mr-4'>
                        Quantity
                        <span className='order-label'>{` ${item.quantity}`}</span>
                      </p>
                      <p>
                        Total Price
                        <span className='order-label'>{` $${item.totalPrice}`}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className='d-none d-md-flex justify-content-between align-items-center box'>
                  <div className='text-center'>
                    <p className='order-label order-status'>{`${item.status}`}</p>
                    <p>Status</p>
                  </div>

                  <div className='text-center'>
                    <p className='order-label'>{` ${item.quantity}`}</p>
                    <p>Quantity</p>
                  </div>

                  <div className='text-center'>
                    <p className='order-label'>{` $${item.totalPrice}`}</p>

                    <p>Total Price</p>
                  </div>
                </div>
              </div>
              {item.product && (
                <div className='text-right mt-2 mt-md-0'>
                  {renderItemsAction(item)}
                </div>
              )}
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default OrderItems;
