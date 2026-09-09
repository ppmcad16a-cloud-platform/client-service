/*
 *
 * Support
 *
 */

import React from 'react';
import { connect } from 'react-redux';

import actions from '../../actions';

import { default as SupportManager } from '../../components/Manager/Support';

// /support page (auth-gated — see Authentication(Support) in
// containers/Application) — thin wrapper around the real live-chat
// implementation in components/Manager/Support.
class Support extends React.PureComponent {
  render() {
    const { user } = this.props;

    return (
      <div className='support'>
        <h3>Support</h3>
        <hr />
        <div className='mt-5'>
          <SupportManager user={user} />
        </div>
      </div>
    );
  }
}

// resetFormData/formErrors are copy/paste leftovers (e.g. from
// AccountSecurity) — unused here, since Support only needs `user`.
const mapStateToProps = state => {
  return {
    user: state.account.user,
    resetFormData: state.resetPassword.resetFormData,
    formErrors: state.resetPassword.formErrors
  };
};

export default connect(mapStateToProps, actions)(Support);
