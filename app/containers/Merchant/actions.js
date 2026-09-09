/*
 *
 * Merchant actions
 *
 */

import { push, goBack } from 'connected-react-router';
import { success } from 'react-notification-system-redux';

import {
  FETCH_MERCHANTS,
  REMOVE_MERCHANT,
  SET_ADVANCED_FILTERS,
  FETCH_SEARCHED_MERCHANTS,
  MERCHANT_CHANGE,
  SET_MERCHANT_FORM_ERRORS,
  SET_MERCHANTS_LOADING,
  SET_MERCHANTS_SUBMITTING,
  RESET_MERCHANT,
  SIGNUP_CHANGE,
  SET_SIGNUP_FORM_ERRORS,
  SIGNUP_RESET
} from './constants';

import handleError from '../../utils/error';
import { allFieldsValidation } from '../../utils/validation';
import graphqlRequest from '../../utils/graphql';
import { signOut } from '../Login/actions';

// Every merchant field selected below (_id, name, email, phoneNumber,
// brandName, business, isActive, status, created) mirrors exactly what the
// old REST JSON body carried.
const MERCHANT_FIELDS = `_id name email phoneNumber brandName business isActive status created`;

const ADD_MERCHANT_MUTATION = `
  mutation AddMerchant($name: String, $email: String, $phoneNumber: String, $brandName: String, $business: String) {
    addMerchant(name: $name, email: $email, phoneNumber: $phoneNumber, brandName: $brandName, business: $business) {
      success
      message
    }
  }
`;

const MERCHANTS_QUERY = `
  query Merchants($page: Int, $limit: Int) {
    merchants(page: $page, limit: $limit) {
      merchants { ${MERCHANT_FIELDS} }
      totalPages
      currentPage
      count
    }
  }
`;

const MERCHANT_SEARCH_QUERY = `
  query MerchantSearch($search: String) {
    merchantSearch(search: $search) {
      merchants { ${MERCHANT_FIELDS} }
    }
  }
`;

const SET_MERCHANT_ACTIVE_MUTATION = `
  mutation SetMerchantActive($merchantId: ID!, $isActive: Boolean!) {
    setMerchantActive(merchantId: $merchantId, isActive: $isActive) {
      success
    }
  }
`;

const APPROVE_MERCHANT_MUTATION = `
  mutation ApproveMerchant($merchantId: ID!) {
    approveMerchant(merchantId: $merchantId) {
      success
    }
  }
`;

const REJECT_MERCHANT_MUTATION = `
  mutation RejectMerchant($merchantId: ID!) {
    rejectMerchant(merchantId: $merchantId) {
      success
    }
  }
`;

const MERCHANT_SIGNUP_MUTATION = `
  mutation MerchantSignup($token: String!, $email: String, $password: String, $firstName: String, $lastName: String) {
    merchantSignup(token: $token, email: $email, password: $password, firstName: $firstName, lastName: $lastName) {
      success
    }
  }
`;

const DELETE_MERCHANT_MUTATION = `
  mutation DeleteMerchant($merchantId: ID!) {
    deleteMerchant(merchantId: $merchantId) {
      success
      message
    }
  }
`;

// Merchant duck covers two distinct flows sharing one reducer: the admin's
// merchant-application management (merchantFormData/formErrors — used by
// both the public "become a merchant" form and the admin's manual add) and
// a merchant's own account completion after approval (signupFormData/
// signupFormErrors, used by containers/MerchantSignup via merchantSignUp
// below).
export const merchantChange = (name, value) => {
  let formData = {};
  formData[name] = value;

  return {
    type: MERCHANT_CHANGE,
    payload: formData
  };
};

export const merchantSignupChange = (name, value) => {
  let formData = {};
  formData[name] = value;

  return {
    type: SIGNUP_CHANGE,
    payload: formData
  };
};

export const setMerchantLoading = value => {
  return {
    type: SET_MERCHANTS_LOADING,
    payload: value
  };
};

export const setMerchantSubmitting = value => {
  return {
    type: SET_MERCHANTS_SUBMITTING,
    payload: value
  };
};

// add merchant api
export const addMerchant = (isBack = false) => {
  return async (dispatch, getState) => {
    try {
      const phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

      const rules = {
        name: 'required',
        email: 'required|email',
        phoneNumber: ['required', `regex:${phoneno}`],
        brandName: 'required',
        business: 'required|min:10'
      };

      const merchant = getState().merchant.merchantFormData;

      const { isValid, errors } = allFieldsValidation(merchant, rules, {
        'required.name': 'Name is required.',
        'required.email': 'Email is required.',
        'email.email': 'Email format is invalid.',
        'required.phoneNumber': 'Phone number is required.',
        'regex.phoneNumber': 'Phone number format is invalid.',
        'required.brandName': 'Brand is required.',
        'required.business': 'Business is required.',
        'min.business': 'Business must be at least 10 characters.'
      });

      if (!isValid) {
        return dispatch({ type: SET_MERCHANT_FORM_ERRORS, payload: errors });
      }

      dispatch(setMerchantLoading(true));
      dispatch(setMerchantSubmitting(true));

      const data = await graphqlRequest(ADD_MERCHANT_MUTATION, merchant);
      const result = data.addMerchant;

      const successfulOptions = {
        title: `${result.message}`,
        position: 'tr',
        autoDismiss: 1
      };

      if (result.success === true) {
        dispatch(success(successfulOptions));
        dispatch({ type: RESET_MERCHANT });
        if (isBack) dispatch(goBack());
      }
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setMerchantSubmitting(false));
      dispatch(setMerchantLoading(false));
    }
  };
};

export const fetchMerchants = (n, v) => {
  return async (dispatch, getState) => {
    try {
      dispatch(setMerchantLoading(true));

      const data = await graphqlRequest(MERCHANTS_QUERY, { page: v ?? 1, limit: 20 });
      const { merchants, totalPages, currentPage, count } = data.merchants;

      dispatch({
        type: FETCH_MERCHANTS,
        payload: merchants
      });

      dispatch({
        type: SET_ADVANCED_FILTERS,
        payload: { totalPages, currentPage, count }
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setMerchantLoading(false));
    }
  };
};

export const searchMerchants = filter => {
  return async (dispatch, getState) => {
    try {
      dispatch(setMerchantLoading(true));

      const data = await graphqlRequest(MERCHANT_SEARCH_QUERY, { search: filter.value });

      dispatch({
        type: FETCH_SEARCHED_MERCHANTS,
        payload: data.merchantSearch.merchants
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setMerchantLoading(false));
    }
  };
};

// disableMerchant/approveMerchant/rejectMerchant/deleteMerchant all follow
// the same pattern: mutate on the server, then just re-run whichever list
// query was active (search vs. the plain paginated list) rather than
// patching the item in place locally.
export const disableMerchant = (merchant, value, search, page) => {
  return async (dispatch, getState) => {
    try {
      await graphqlRequest(SET_MERCHANT_ACTIVE_MUTATION, {
        merchantId: merchant._id,
        isActive: value
      });

      if (search)
        return dispatch(searchMerchants({ name: 'merchant', value: search })); // update search list if this is a search result
      dispatch(fetchMerchants('merchant', page));
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const approveMerchant = (merchant, search, page) => {
  return async (dispatch, getState) => {
    try {
      await graphqlRequest(APPROVE_MERCHANT_MUTATION, { merchantId: merchant._id });

      if (search)
        return dispatch(searchMerchants({ name: 'merchant', value: search })); // update search list if this is a search result
      dispatch(fetchMerchants('merchant', page));
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const rejectMerchant = (merchant, search, page) => {
  return async (dispatch, getState) => {
    try {
      await graphqlRequest(REJECT_MERCHANT_MUTATION, { merchantId: merchant._id });

      if (search)
        return dispatch(searchMerchants({ name: 'merchant', value: search })); // update search list if this is a search result
      dispatch(fetchMerchants('merchant', page));
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

// Completes signup for a newly-approved merchant using the token from their
// merchant-signup link (server POST /merchant/signup/:token). Forces a
// sign-out afterward since the flow expects them to log back in fresh with
// their new credentials.
export const merchantSignUp = token => {
  return async (dispatch, getState) => {
    try {
      const rules = {
        email: 'required|email',
        password: 'required|min:6',
        firstName: 'required',
        lastName: 'required'
      };

      const merchant = getState().merchant.signupFormData;

      const { isValid, errors } = allFieldsValidation(merchant, rules, {
        'required.email': 'Email is required.',
        'required.password': 'Password is required.',
        'required.firstName': 'First Name is required.',
        'required.lastName': 'Last Name is required.'
      });

      if (!isValid) {
        return dispatch({ type: SET_SIGNUP_FORM_ERRORS, payload: errors });
      }

      await graphqlRequest(MERCHANT_SIGNUP_MUTATION, { token, ...merchant });

      const successfulOptions = {
        title: `You have signed up successfully! Please sign in with the email and password. Thank you!`,
        position: 'tr',
        autoDismiss: 1
      };

      dispatch(signOut());
      dispatch(success(successfulOptions));
      dispatch(push('/login'));
      dispatch({ type: SIGNUP_RESET });
    } catch (error) {
      const title = `Please try to signup again!`;
      handleError(error, dispatch, title);
    }
  };
};

// delete merchant api
export const deleteMerchant = (merchant, search, page) => {
  return async (dispatch, getState) => {
    try {
      const data = await graphqlRequest(DELETE_MERCHANT_MUTATION, { merchantId: merchant._id });
      const result = data.deleteMerchant;

      const successfulOptions = {
        title: `${result.message}`,
        position: 'tr',
        autoDismiss: 1
      };

      if (result.success === true) {
        dispatch(success(successfulOptions));

        if (search)
          return dispatch(searchMerchants({ name: 'merchant', value: search })); // update search list if this is a search result

        // Re-fetches instead (see the disableMerchant note above) rather
        // than the optimistic local removal below, which is dead code.
        dispatch(fetchMerchants('merchant', page));

        // dispatch({
        //   type: REMOVE_MERCHANT,
        //   payload: merchant._id
        // });
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};
