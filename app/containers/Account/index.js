/*
 *
 * Account
 *
 */

import React from 'react';
import { connect } from 'react-redux';

import actions from '../../actions';

import AccountDetails from '../../components/Manager/AccountDetails';
import SubPage from '../../components/Manager/SubPage';

// Dashboard "Account Details" tab (the default /dashboard route). Doesn't
// fetch the profile itself (see the commented-out call below) — relies on
// containers/Application having already called fetchProfile on app load.
class Account extends React.PureComponent {
  componentDidMount() {
    // this.props.fetchProfile();
  }

  render() {
    const { user, accountChange, updateProfile } = this.props;

    return (
      <div className='account'>
        <SubPage title={'Account Details'} isMenuOpen={null}>
          <AccountDetails
            user={user}
            accountChange={accountChange}
            updateProfile={updateProfile}
          />
        </SubPage>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.account.user,
    resetFormData: state.resetPassword.resetFormData,
    formErrors: state.resetPassword.formErrors
  };
};

export default connect(mapStateToProps, actions)(Account);
