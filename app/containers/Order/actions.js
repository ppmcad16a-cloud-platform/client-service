/*
 *
 * Order actions
 *
 */

import { push } from 'connected-react-router';
import { success } from 'react-notification-system-redux';

import {
  FETCH_ORDERS,
  FETCH_SEARCHED_ORDERS,
  FETCH_ORDER,
  UPDATE_ORDER_STATUS,
  SET_ORDERS_LOADING,
  SET_ADVANCED_FILTERS,
  CLEAR_ORDERS
} from './constants';

import { clearCart, getCartId } from '../Cart/actions';
import { toggleCart } from '../Navigation/actions';
import handleError from '../../utils/error';
import graphqlRequest from '../../utils/graphql';

// Every order field selected below (_id, total, totalTax, totalWithTax,
// created, cartId, products) mirrors exactly what the old REST JSON body
// carried — `products` is a single opaque JSON blob field server-side
// (app/graphql/types.py's GenericScalar), not individually-selectable
// GraphQL fields, so the nested per-item shape
// (products[i]._id/product/quantity/status/totalPrice/...) client
// components already read is unchanged.
const ORDER_FIELDS = `_id total totalTax totalWithTax created cartId products`;

const ORDERS_QUERY = `
  query Orders($page: Int, $limit: Int) {
    orders(page: $page, limit: $limit) {
      orders { ${ORDER_FIELDS} }
      totalPages
      currentPage
      count
    }
  }
`;

const MY_ORDERS_QUERY = `
  query MyOrders($page: Int, $limit: Int) {
    myOrders(page: $page, limit: $limit) {
      orders { ${ORDER_FIELDS} }
      totalPages
      currentPage
      count
    }
  }
`;

const ORDER_SEARCH_QUERY = `
  query OrderSearch($search: String) {
    orderSearch(search: $search) {
      orders { ${ORDER_FIELDS} }
    }
  }
`;

const ORDER_QUERY = `
  query Order($id: ID!) {
    order(id: $id) { ${ORDER_FIELDS} }
  }
`;

const CANCEL_ORDER_MUTATION = `
  mutation CancelOrder($orderId: ID!) {
    cancelOrder(orderId: $orderId) {
      success
    }
  }
`;

const UPDATE_ORDER_ITEM_STATUS_MUTATION = `
  mutation UpdateOrderItemStatus($itemId: ID!, $orderId: ID, $cartId: ID, $status: String) {
    updateOrderItemStatus(itemId: $itemId, orderId: $orderId, cartId: $cartId, status: $status) {
      success
      orderCancelled
      message
    }
  }
`;

const PLACE_ORDER_MUTATION = `
  mutation PlaceOrder($cartId: ID!, $total: Float) {
    placeOrder(cartId: $cartId, total: $total) {
      success
      order { _id }
    }
  }
`;

// Order duck. fetchOrders (all orders, admin) and fetchAccountOrders (the
// logged-in user's own orders) both write into the same `orders` state key
// — see reducer.js — so switching between the two views relies on whichever
// fetched most recently being the one currently relevant.
export const updateOrderStatus = value => {
  return {
    type: UPDATE_ORDER_STATUS,
    payload: value
  };
};

export const setOrderLoading = value => {
  return {
    type: SET_ORDERS_LOADING,
    payload: value
  };
};

export const fetchOrders = (page = 1) => {
  return async (dispatch, getState) => {
    try {
      dispatch(setOrderLoading(true));

      const data = await graphqlRequest(ORDERS_QUERY, { page: page ?? 1, limit: 20 });
      const { orders, totalPages, currentPage, count } = data.orders;

      dispatch({
        type: FETCH_ORDERS,
        payload: orders
      });

      dispatch({
        type: SET_ADVANCED_FILTERS,
        payload: { totalPages, currentPage, count }
      });
    } catch (error) {
      dispatch(clearOrders());
      handleError(error, dispatch);
    } finally {
      dispatch(setOrderLoading(false));
    }
  };
};

export const fetchAccountOrders = (page = 1) => {
  return async (dispatch, getState) => {
    try {
      dispatch(setOrderLoading(true));

      const data = await graphqlRequest(MY_ORDERS_QUERY, { page: page ?? 1, limit: 20 });
      const { orders, totalPages, currentPage, count } = data.myOrders;

      dispatch({
        type: FETCH_ORDERS,
        payload: orders
      });

      dispatch({
        type: SET_ADVANCED_FILTERS,
        payload: { totalPages, currentPage, count }
      });
    } catch (error) {
      dispatch(clearOrders());
      handleError(error, dispatch);
    } finally {
      dispatch(setOrderLoading(false));
    }
  };
};

export const searchOrders = filter => {
  return async (dispatch, getState) => {
    try {
      dispatch(setOrderLoading(true));

      const data = await graphqlRequest(ORDER_SEARCH_QUERY, { search: filter.value });

      dispatch({
        type: FETCH_SEARCHED_ORDERS,
        payload: data.orderSearch.orders
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setOrderLoading(false));
    }
  };
};

export const fetchOrder = (id, withLoading = true) => {
  return async (dispatch, getState) => {
    try {
      if (withLoading) {
        dispatch(setOrderLoading(true));
      }

      const data = await graphqlRequest(ORDER_QUERY, { id });

      dispatch({
        type: FETCH_ORDER,
        payload: data.order
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      if (withLoading) {
        dispatch(setOrderLoading(false));
      }
    }
  };
};

export const cancelOrder = () => {
  return async (dispatch, getState) => {
    try {
      const order = getState().order.order;

      await graphqlRequest(CANCEL_ORDER_MUTATION, { orderId: order._id });

      dispatch(push(`/dashboard/orders`));
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const updateOrderItemStatus = (itemId, status) => {
  return async (dispatch, getState) => {
    try {
      const order = getState().order.order;

      const data = await graphqlRequest(UPDATE_ORDER_ITEM_STATUS_MUTATION, {
        itemId,
        orderId: order._id,
        cartId: order.cartId,
        status
      });
      const result = data.updateOrderItemStatus;

      if (result.orderCancelled) {
        dispatch(push(`/dashboard/orders`));
      } else {
        dispatch(updateOrderStatus({ itemId, status }));
        dispatch(fetchOrder(order._id, false));
      }

      const successfulOptions = {
        title: `${result.message}`,
        position: 'tr',
        autoDismiss: 1
      };

      dispatch(success(successfulOptions));
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

// Actually places the order against whatever server-side cart id is
// currently stored — see the staleness caveat on Cart/actions.js#getCartId
// regarding what "current" means here.
export const addOrder = () => {
  return async (dispatch, getState) => {
    try {
      const cartId = localStorage.getItem('cart_id');
      const total = getState().cart.cartTotal;

      if (cartId) {
        const data = await graphqlRequest(PLACE_ORDER_MUTATION, { cartId, total });

        dispatch(push(`/order/success/${data.placeOrder.order._id}`));
        dispatch(clearCart());
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

// Entry point from the cart's "Place Order" button: ensures a server cart
// id exists (creating one if needed) before actually placing the order.
export const placeOrder = () => {
  return (dispatch, getState) => {
    const token = localStorage.getItem('token');

    const cartItems = getState().cart.cartItems;

    if (token && cartItems.length > 0) {
      Promise.all([dispatch(getCartId())]).then(() => {
        dispatch(addOrder());
      });
    }

    dispatch(toggleCart());
  };
};

export const clearOrders = () => {
  return {
    type: CLEAR_ORDERS
  };
};
