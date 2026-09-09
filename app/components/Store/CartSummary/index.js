/**
 *
 * CartSummary
 *
 */

import React from 'react';

import { Container, Row, Col } from 'reactstrap';

// Pre-checkout cart total (in the cart dropdown/drawer). NOTE: unlike the
// post-purchase Manager/OrderSummary (which breaks out an estimated sales
// tax line from utils/store.js#caculateTaxAmount), this pre-checkout summary
// shows no tax line at all — `cartTotal` is the untaxed subtotal, so the
// amount shown here can be lower than what the order actually totals once
// placed.
const CartSummary = props => {
  const { cartTotal } = props;

  return (
    <div className='cart-summary'>
      <Container>
        <Row className='mb-2 summary-item'>
          <Col xs='9'>
            <p className='summary-label'>Shippling</p>
          </Col>
          <Col xs='3' className='text-right'>
            <p className='summary-value'>Free</p>
          </Col>
        </Row>
        <Row className='mb-2 summary-item'>
          <Col xs='9'>
            <p className='summary-label'>Total</p>
          </Col>
          <Col xs='3' className='text-right'>
            <p className='summary-value'>${cartTotal}</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CartSummary;
