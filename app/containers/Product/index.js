/*
 *
 * Product
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import actions from '../../actions';

// import { ROLES } from '../../constants';
import List from './List';
import Add from './Add';
import Edit from './Edit';
import Page404 from '../../components/Common/Page404';

// Dashboard product routes (/dashboard/product/*) — reachable by both
// Admin and Merchant (see Manager/Dashboard/Admin.js vs Merchant.js).
// NOTE: an Admin-only restriction on the /add route was apparently
// considered (see the commented-out ROLES check) but never enabled —
// merchants can add products same as admins today.
class Product extends React.PureComponent {
  render() {
    const { user } = this.props;

    return (
      <div className='product-dashboard'>
        <Switch>
          <Route exact path='/dashboard/product' component={List} />
          <Route exact path='/dashboard/product/edit/:id' component={Edit} />
          {/* {user.role === ROLES.Admin && ( */}
          <Route exact path='/dashboard/product/add' component={Add} />
          {/* )} */}
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

export default connect(mapStateToProps, actions)(Product);
