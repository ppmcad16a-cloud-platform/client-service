/*
 *
 * Order
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import { ROLES } from '../../constants';
import actions from '../../actions';
import List from './List';
import Customer from './Customer';
import Page404 from '../../components/Common/Page404';

// Dashboard order routes. NOTE the naming is easy to misread: List.js is
// "Your Orders" (the logged-in user's own, via fetchAccountOrders) and
// Customer.js is "Customer Orders" — the admin-only view of every order
// across all customers (via fetchOrders). It's not List = admin,
// Customer = one customer, as the names might suggest.
class Order extends React.PureComponent {
  render() {
    const { user } = this.props;

    return (
      <div className='product-dashboard'>
        <Switch>
          <Route exact path='/dashboard/orders' component={List} />
          {user.role === ROLES.Admin && (
            <Route
              exact
              path='/dashboard/orders/customers'
              component={Customer}
            />
          )}
          <Route path='*' component={Page404} />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.account.user
  };
};

export default connect(mapStateToProps, actions)(Order);
