/*
 *
 * reducers.js
 * reducers configuration
 *
 * The other half of the ducks-pattern wiring (see actions.js): imports every
 * container's reducer.js and combines them under a key matching the feature
 * name, so state is read as e.g. `state.cart`, `state.product`. A new
 * feature's reducer must be added to the combineReducers call below or its
 * state updates are silently dropped.
 */

import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { reducer as notifications } from 'react-notification-system-redux';

// import reducers
import applicationReducer from './containers/Application/reducer';
import homepageReducer from './containers/Homepage/reducer';
import signupReducer from './containers/Signup/reducer';
import loginReducer from './containers/Login/reducer';
import forgotPasswordReducer from './containers/ForgotPassword/reducer';
import navigationReducer from './containers/Navigation/reducer';
import authenticationReducer from './containers/Authentication/reducer';
import cartReducer from './containers/Cart/reducer';
import dashboardReducer from './containers/Dashboard/reducer';
import accountReducer from './containers/Account/reducer';
import addressReducer from './containers/Address/reducer';
import resetPasswordReducer from './containers/ResetPassword/reducer';
import usersReducer from './containers/Users/reducer';
import productReducer from './containers/Product/reducer';
import categoryReducer from './containers/Category/reducer';
import brandReducer from './containers/Brand/reducer';
import navigationMenuReducer from './containers/NavigationMenu/reducer';
import shopReducer from './containers/Shop/reducer';
import merchantReducer from './containers/Merchant/reducer';
import contactReducer from './containers/Contact/reducer';
import orderReducer from './containers/Order/reducer';
import reviewReducer from './containers/Review/reducer';
import wishListReducer from './containers/WishList/reducer';

const createReducer = history =>
  combineReducers({
    router: connectRouter(history),
    notifications,
    application: applicationReducer,
    homepage: homepageReducer,
    signup: signupReducer,
    login: loginReducer,
    forgotPassword: forgotPasswordReducer,
    navigation: navigationReducer,
    authentication: authenticationReducer,
    cart: cartReducer,
    dashboard: dashboardReducer,
    account: accountReducer,
    address: addressReducer,
    resetPassword: resetPasswordReducer,
    users: usersReducer,
    product: productReducer,
    category: categoryReducer,
    brand: brandReducer,
    menu: navigationMenuReducer,
    shop: shopReducer,
    merchant: merchantReducer,
    contact: contactReducer,
    order: orderReducer,
    review: reviewReducer,
    wishlist: wishListReducer
  });

export default createReducer;
