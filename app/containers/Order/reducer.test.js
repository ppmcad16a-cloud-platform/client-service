import orderReducer from './reducer';
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
  orders: [],
  searchedOrders: [],
  order: { _id: '', cartId: '', products: [], totalTax: 0, total: 0, status: '' },
  isLoading: false,
  advancedFilters: { totalPages: 1, currentPage: 1, count: 0 }
};

it('returns the initial state by default', () => {
  expect(orderReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
});

it('stores the fetched orders list', () => {
  const orders = [{ _id: '1' }];
  expect(orderReducer(initialState, { type: FETCH_ORDERS, payload: orders }).orders).toBe(orders);
});

it('stores the searched orders list', () => {
  const orders = [{ _id: '1' }];
  expect(
    orderReducer(initialState, { type: FETCH_SEARCHED_ORDERS, payload: orders }).searchedOrders
  ).toBe(orders);
});

it('stores a single fetched order', () => {
  const order = { _id: '1', total: 10 };
  expect(orderReducer(initialState, { type: FETCH_ORDER, payload: order }).order).toBe(order);
});

it('merges advanced filters', () => {
  const state = orderReducer(initialState, { type: SET_ADVANCED_FILTERS, payload: { currentPage: 2 } });
  expect(state.advancedFilters).toEqual({ ...initialState.advancedFilters, currentPage: 2 });
});

it('updates a single line item status within the current order', () => {
  const withOrder = {
    ...initialState,
    order: {
      ...initialState.order,
      products: [{ _id: 'item-1', status: 'Not processed' }, { _id: 'item-2', status: 'Not processed' }]
    }
  };
  const state = orderReducer(withOrder, {
    type: UPDATE_ORDER_STATUS,
    payload: { itemId: 'item-2', status: 'Shipped' }
  });
  expect(state.order.products).toEqual([
    { _id: 'item-1', status: 'Not processed' },
    { _id: 'item-2', status: 'Shipped' }
  ]);
});

it('sets the loading flag', () => {
  expect(orderReducer(initialState, { type: SET_ORDERS_LOADING, payload: true }).isLoading).toBe(true);
});

it('clears the orders list', () => {
  const dirty = { ...initialState, orders: [{ _id: '1' }] };
  expect(orderReducer(dirty, { type: CLEAR_ORDERS }).orders).toEqual([]);
});

it('returns the existing state for an unknown action', () => {
  expect(orderReducer(initialState, { type: 'UNKNOWN' })).toBe(initialState);
});
