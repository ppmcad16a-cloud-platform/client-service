/**
 *
 * OrderPage
 *
 */

import React from 'react';

import { connect } from 'react-redux';

import actions from '../../actions';

import OrderDetails from '../../components/Manager/OrderDetails';
import NotFound from '../../components/Common/NotFound';
import LoadingIndicator from '../../components/Common/LoadingIndicator';

// Single order detail page (/order/:id) — shared by both the dashboard's
// order list links and OrderSuccess's post-checkout link.
class OrderPage extends React.PureComponent {
  componentDidMount() {
    const id = this.props.match.params.id;
    this.props.fetchOrder(id);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      const id = this.props.match.params.id;
      this.props.fetchOrder(id);
    }
  }

  render() {
    const {
      history,
      order,
      user,
      isLoading,
      cancelOrder,
      updateOrderItemStatus
    } = this.props;

    return (
      <div className='order-page'>
        {isLoading ? (
          <LoadingIndicator backdrop />
        ) : order._id ? (
          <OrderDetails
            order={order}
            user={user}
            cancelOrder={cancelOrder}
            updateOrderItemStatus={updateOrderItemStatus}
            // Detects arriving here from OrderSuccess via its `?success`
            // query string (see OrderSuccess's Link below) and routes "back"
            // to the orders list instead of literally going back in
            // history, which would just return to the (already-passed)
            // success page.
            onBack={() => {
              if (window.location.toString().includes('success')) {
                history.push('/dashboard/orders');
              } else {
                history.goBack();
              }
            }}
          />
        ) : (
          <NotFound message='No order found.' />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.account.user,
    order: state.order.order,
    isLoading: state.order.isLoading
  };
};

export default connect(mapStateToProps, actions)(OrderPage);
