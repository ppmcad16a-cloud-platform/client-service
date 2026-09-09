/**
 *
 * Checkout
 *
 */

import React from 'react';

import Button from '../../Common/Button';

// Cart dropdown's action row. Logged-out users get "Proceed To Checkout"
// (which redirects to /login — see Cart/actions.js#handleCheckout);
// logged-in users skip straight to placing the order.
const Checkout = props => {
  const { authenticated, handleShopping, handleCheckout, placeOrder } = props;

  return (
    <div className='easy-checkout'>
      <div className='checkout-actions'>
        <Button
          variant='primary'
          text='Continue shopping'
          onClick={() => handleShopping()}
        />
        {authenticated ? (
          <Button
            variant='primary'
            text='Place Order'
            onClick={() => placeOrder()}
          />
        ) : (
          <Button
            variant='primary'
            text='Proceed To Checkout'
            onClick={() => handleCheckout()}
          />
        )}
      </div>
    </div>
  );
};

export default Checkout;
