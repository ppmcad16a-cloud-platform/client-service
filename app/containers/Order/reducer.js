/*
 *
 * Order reducer
 *
 */

import {
  FETCH_ORDERS,
  FETCH_SEARCHED_ORDERS,
  FETCH_ORDER,
  UPDATE_ORDER_STATUS,
  SET_ORDERS_LOADING,
  SET_ADVANCED_FILTERS,
  CLEAR_ORDERS
} from './constants';

const initialState = {
  // Shared by both "my orders" (List.js/fetchAccountOrders) and "all
  // customer orders" (Customer.js/fetchOrders) — only one view's data is
  // ever in here at a time, whichever fetched most recently.
  orders: [],
  // Only populated by Customer.js's server-side search; List.js's own
  // search instead filters the `orders` array above client-side.
  searchedOrders: [],
  order: {
    _id: '',
    cartId: '',
    products: [],
    totalTax: 0,
    total: 0,
    status: ''
  },
  isLoading: false,
  advancedFilters: {
    totalPages: 1,
    currentPage: 1,
    count: 0
  }
};

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ORDERS:
      return {
        ...state,
        orders: action.payload
      };
    case FETCH_SEARCHED_ORDERS:
      return {
        ...state,
        searchedOrders: action.payload
      };
    case FETCH_ORDER:
      return {
        ...state,
        order: action.payload
      };
    case SET_ADVANCED_FILTERS:
      return {
        ...state,
        advancedFilters: {
          ...state.advancedFilters,
          ...action.payload
        }
      };
    case UPDATE_ORDER_STATUS:
      const itemIndex = state.order.products.findIndex(
        item => item._id === action.payload.itemId
      );

      // Mutates the found item in place (newProducts[itemIndex] is the same
      // object reference as state.order.products[itemIndex]) before
      // spreading the array — works because a fresh `order` is dispatched
      // from fetchOrder right after this anyway, but the array itself isn't
      // purely rebuilt here.
      const newProducts = [...state.order.products];
      newProducts[itemIndex].status = action.payload.status;
      return {
        ...state,
        order: {
          ...state.order,
          products: newProducts
        }
      };
    case SET_ORDERS_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case CLEAR_ORDERS:
      return {
        ...state,
        orders: []
      };
    default:
      return state;
  }
  /* v8 ignore next -- every case returns explicitly; this closing brace is a coverage artifact of UPDATE_ORDER_STATUS's case-scoped `const`s, not reachable dead code */
};

export default orderReducer;
