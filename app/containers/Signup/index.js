/*
 *
 * Signup
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { Redirect, Link } from 'react-router-dom';

import actions from '../../actions';

import Input from '../../components/Common/Input';
import Button from '../../components/Common/Button';
import LoadingIndicator from '../../components/Common/LoadingIndicator';

// /register page. Redirects to /dashboard if already authenticated.
class Signup extends React.PureComponent {
  render() {
    const {
      authenticated,
      signupFormData,
      formErrors,
      isLoading,
      isSubmitting,
      signupChange,
      signUp
    } = this.props;

    if (authenticated) return <Redirect to='/dashboard' />;

    const handleSubmit = event => {
      event.preventDefault();
      signUp();
    };

    return (
      <div className='signup-form'>
        {isLoading && <LoadingIndicator />}
        <h2>Sign Up</h2>
        <hr />
        <form onSubmit={handleSubmit} noValidate>
          <Row>
            <Col xs='12' md='12'>
              <Input
                type={'text'}
                error={formErrors['email']}
                label={'Email Address'}
                name={'email'}
                placeholder={'Please Enter Your Email'}
                value={signupFormData.email}
                onInputChange={(name, value) => {
                  signupChange(name, value);
                }}
              />
            </Col>
            <Col xs='12' md='12'>
              <Input
                type={'text'}
                error={formErrors['firstName']}
                label={'First Name'}
                name={'firstName'}
                placeholder={'Please Enter Your First Name'}
                value={signupFormData.firstName}
                onInputChange={(name, value) => {
                  signupChange(name, value);
                }}
              />
            </Col>
            <Col xs='12' md='12'>
              <Input
                type={'text'}
                error={formErrors['lastName']}
                label={'Last Name'}
                name={'lastName'}
                placeholder={'Please Enter Your Last Name'}
                value={signupFormData.lastName}
                onInputChange={(name, value) => {
                  signupChange(name, value);
                }}
              />
            </Col>
            <Col xs='12' md='12'>
              <Input
                type={'password'}
                label={'Password'}
                error={formErrors['password']}
                name={'password'}
                placeholder={'Please Enter Your Password'}
                value={signupFormData.password}
                onInputChange={(name, value) => {
                  signupChange(name, value);
                }}
              />
            </Col>
          </Row>
          <hr />
          <div className='d-flex flex-column flex-md-row align-items-md-center justify-content-between'>
            <Button
              type='submit'
              variant='primary'
              text='Sign Up'
              disabled={isSubmitting}
            />
            <Link className='mt-3 mt-md-0 redirect-link' to={'/login'}>
              Back to login
            </Link>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authenticated: state.authentication.authenticated,
    signupFormData: state.signup.signupFormData,
    formErrors: state.signup.formErrors,
    isLoading: state.signup.isLoading,
    isSubmitting: state.signup.isSubmitting
  };
};

export default connect(mapStateToProps, actions)(Signup);
