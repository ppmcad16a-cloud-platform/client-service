/*
 *
 * MerchantSignup
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';

import actions from '../../actions';
import Input from '../../components/Common/Input';
import Button from '../../components/Common/Button';

// /merchant-signup/:token — where a newly-approved merchant sets their
// password and finishes account creation (see Merchant/actions.js's
// merchantSignUp). Reuses the Merchant duck's signupFormData/signupFormErrors
// slice rather than having its own.
class MerchantSignup extends React.PureComponent {
  componentDidMount() {
    // Pre-fills email from the `?email=` query param the signup link
    // included (see server/config/template.js's merchantSignup email —
    // conceptually, since that email is never actually sent; see
    // server/README.md).
    const email = this.props.location.search.split('=')[1];
    this.props.merchantSignupChange('email', email);
  }

  render() {
    const {
      signupFormData,
      formErrors,
      merchantSignupChange,
      merchantSignUp
    } = this.props;

    const handleSubmit = event => {
      const token = this.props.match.params.token;
      event.preventDefault();

      merchantSignUp(token);
    };

    return (
      <div className='merchant-signup-form'>
        <form onSubmit={handleSubmit} noValidate>
          <Row>
            <Col xs={{ size: 12 }} md={{ size: 6, offset: 3 }} className='p-0'>
              <Col xs='12' md='12'>
                <h2 className='text-center'>Complete Sign Up</h2>
                <hr />
              </Col>

              <Col xs='12' md='12'>
                <Input
                  type={'text'}
                  error={formErrors['email']}
                  label={'Email Address'}
                  name={'email'}
                  placeholder={'Please Enter Your Email'}
                  value={signupFormData.email}
                  onInputChange={(name, value) => {
                    merchantSignupChange(name, value);
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
                    merchantSignupChange(name, value);
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
                    merchantSignupChange(name, value);
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
                    merchantSignupChange(name, value);
                  }}
                />
              </Col>
              <Col xs='12' md='12'>
                <Button
                  className='mt-3'
                  type='submit'
                  variant='primary'
                  text='Get Started'
                />
              </Col>
            </Col>
          </Row>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    signupFormData: state.merchant.signupFormData,
    formErrors: state.merchant.signupFormErrors
  };
};

export default connect(mapStateToProps, actions)(MerchantSignup);
