/**
 *
 * Authentication
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import actions from '../../actions';

// Route-auth-guard HOC: wrap any route's component in Authentication(...) to
// require `state.authentication.authenticated`, redirecting to /login
// otherwise (see containers/Application/index.js for usage, e.g. /dashboard,
// /support). This is the only mechanism protected client-side routes use —
// there's no route-config-level "requireAuth" flag, each route opts in
// individually by wrapping its component.
export default function (ComposedComponent) {
  class Authentication extends React.PureComponent {
    render() {
      const { authenticated } = this.props;

      if (!authenticated) {
        return <Redirect to='/login' />;
      } else {
        return <ComposedComponent {...this.props} />;
      }
    }
  }

  const mapStateToProps = state => {
    return {
      authenticated: state.authentication.authenticated
    };
  };

  return connect(mapStateToProps, actions)(Authentication);
}
