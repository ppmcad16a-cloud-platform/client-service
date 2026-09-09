/**
 *
 * CartIcon
 *
 */

import React from 'react';

import { BagIcon } from '../Icon';
import Button from '../Button';

// The bag icon + item-count badge shown in the nav bar; renders as an
// icon-only Button so clicking it (typically toggles the cart dropdown) is
// handled by whatever passes `onClick`, not by this component itself.
const CartIcon = props => {
  const { className, onClick, cartItems } = props;

  const Icon = (
    <span className='cart-icon'>
      <BagIcon />
      {cartItems.length > 0 && (
        <span className='cart-badge'>
          {cartItems.length >= 99 ? '99+' : cartItems.length}
        </span>
      )}
    </span>
  );

  const items = cartItems.length;

  return (
    <Button
      borderless
      variant='empty'
      className={className}
      ariaLabel={
        items > 0 ? `your cart have ${items} items` : 'your cart is empty'
      }
      icon={Icon}
      onClick={onClick}
    />
  );
};

export default CartIcon;
