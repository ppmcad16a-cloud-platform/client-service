/*
 *
 * Merchant
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import actions from '../../actions';
import { ROLES } from '../../constants';
import List from './List';
import Add from './Add';
import Page404 from '../../components/Common/Page404';

// Dashboard merchant-management routes — admin-only (both the list and the
// manual /add form; there's no merchant-facing route here since a merchant
// doesn't manage other merchants).
class Merchant extends React.PureComponent {
  render() {
    const { user } = this.props;

    return (
      <div className='merchant-dashboard'>
        <Switch>
          <Route exact path='/dashboard/merchant' component={List} />
          {user.role === ROLES.Admin && (
            <Route exact path='/dashboard/merchant/add' component={Add} />
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

export default connect(mapStateToProps, actions)(Merchant);
