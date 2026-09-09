import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import {
  updateOrderStatus,
  setOrderLoading,
  fetchOrders,
  fetchAccountOrders,
  searchOrders,
  fetchOrder,
  cancelOrder,
  updateOrderItemStatus,
  addOrder,
  placeOrder,
  clearOrders
} from './actions';
import {
  FETCH_ORDERS,
  FETCH_SEARCHED_ORDERS,
  FETCH_ORDER,
  UPDATE_ORDER_STATUS,
  SET_ORDERS_LOADING,
  SET_ADVANCED_FILTERS,
  CLEAR_ORDERS
} from './constants';
import { API_URL } from '../../constants';

const mock = new MockAdapter(axios);
const GRAPHQL_URL = `${API_URL}/graphql`;

afterEach(() => {
  mock.reset();
  localStorage.clear();
});

const flush = () => new Promise(resolve => setTimeout(resolve, 0));

// Every server call in this duck now goes through the same POST
// /api/graphql endpoint, so tests distinguish requests by inspecting the
// posted body (JSON-parsed) rather than by URL/method the way REST mocks
// used to.
const lastRequestBody = () => JSON.parse(mock.history.post.at(-1).data);

it('updateOrderStatus carries the raw payload', () => {
  expect(updateOrderStatus({ itemId: '1', status: 'Shipped' })).toEqual({
    type: UPDATE_ORDER_STATUS,
    payload: { itemId: '1', status: 'Shipped' }
  });
});

it('setOrderLoading carries the loading flag', () => {
  expect(setOrderLoading(true)).toEqual({ type: SET_ORDERS_LOADING, payload: true });
});

it('clearOrders is a plain action', () => {
  expect(clearOrders()).toEqual({ type: CLEAR_ORDERS });
});

describe('fetchOrders', () => {
  it('fetches a page of orders and merges pagination info', async () => {
    mock.onPost(GRAPHQL_URL).reply(200, {
      data: { orders: { orders: [{ _id: '1' }], totalPages: 2, currentPage: 1, count: 15 } }
    });
    const dispatch = vi.fn();

    await fetchOrders(1)(dispatch, () => ({}));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toEqual([SET_ORDERS_LOADING, FETCH_ORDERS, SET_ADVANCED_FILTERS, SET_ORDERS_LOADING]);
  });

  it('clears the orders list and shows an error on failure', async () => {
    mock.onPost(GRAPHQL_URL).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await fetchOrders()(dispatch, () => ({}));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toEqual([SET_ORDERS_LOADING, CLEAR_ORDERS, 'RNS_SHOW_NOTIFICATION', SET_ORDERS_LOADING]);
  });

  it('falls back to page 1 when explicitly passed a nullish page (default param only covers undefined)', async () => {
    mock.onPost(GRAPHQL_URL).reply(200, {
      data: { orders: { orders: [], totalPages: 1, currentPage: 1, count: 0 } }
    });
    const dispatch = vi.fn();

    await fetchOrders(null)(dispatch, () => ({}));

    expect(lastRequestBody().variables.page).toBe(1);
  });
});

describe('fetchAccountOrders', () => {
  it("fetches the caller's own orders and merges pagination info", async () => {
    mock.onPost(GRAPHQL_URL).reply(200, {
      data: { myOrders: { orders: [{ _id: '1' }], totalPages: 1, currentPage: 1, count: 1 } }
    });
    const dispatch = vi.fn();

    await fetchAccountOrders()(dispatch, () => ({}));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toEqual([SET_ORDERS_LOADING, FETCH_ORDERS, SET_ADVANCED_FILTERS, SET_ORDERS_LOADING]);
  });

  it('clears the orders list and shows an error on failure', async () => {
    mock.onPost(GRAPHQL_URL).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await fetchAccountOrders()(dispatch, () => ({}));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toEqual([SET_ORDERS_LOADING, CLEAR_ORDERS, 'RNS_SHOW_NOTIFICATION', SET_ORDERS_LOADING]);
  });

  it('falls back to page 1 when explicitly passed a nullish page (default param only covers undefined)', async () => {
    mock.onPost(GRAPHQL_URL).reply(200, {
      data: { myOrders: { orders: [], totalPages: 1, currentPage: 1, count: 0 } }
    });
    const dispatch = vi.fn();

    await fetchAccountOrders(null)(dispatch, () => ({}));

    expect(lastRequestBody().variables.page).toBe(1);
  });
});

describe('searchOrders', () => {
  it('searches orders by the given filter value', async () => {
    mock.onPost(GRAPHQL_URL).reply(200, { data: { orderSearch: { orders: [{ _id: '1' }] } } });
    const dispatch = vi.fn();

    await searchOrders({ value: 'abc123' })(dispatch, () => ({}));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toEqual([SET_ORDERS_LOADING, FETCH_SEARCHED_ORDERS, SET_ORDERS_LOADING]);
    expect(lastRequestBody().variables.search).toBe('abc123');
  });

  it('handles a failed search', async () => {
    mock.onPost(GRAPHQL_URL).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await searchOrders({ value: 'abc123' })(dispatch, () => ({}));

    expect(dispatch.mock.calls.at(-1)[0]).toEqual({ type: SET_ORDERS_LOADING, payload: false });
  });
});

describe('fetchOrder', () => {
  it('fetches an order, toggling loading around it by default', async () => {
    mock.onPost(GRAPHQL_URL).reply(200, { data: { order: { _id: '1' } } });
    const dispatch = vi.fn();

    await fetchOrder('1')(dispatch, () => ({}));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toEqual([SET_ORDERS_LOADING, FETCH_ORDER, SET_ORDERS_LOADING]);
  });

  it('skips the loading toggle when withLoading is false', async () => {
    mock.onPost(GRAPHQL_URL).reply(200, { data: { order: { _id: '1' } } });
    const dispatch = vi.fn();

    await fetchOrder('1', false)(dispatch, () => ({}));

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({ type: FETCH_ORDER, payload: { _id: '1' } });
  });

  it('handles a failed fetch', async () => {
    mock.onPost(GRAPHQL_URL).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await fetchOrder('1')(dispatch, () => ({}));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toContain('RNS_SHOW_NOTIFICATION');
  });
});

describe('cancelOrder', () => {
  it('cancels the order and redirects to the orders list', async () => {
    mock.onPost(GRAPHQL_URL).reply(200, { data: { cancelOrder: { success: true } } });
    const dispatch = vi.fn();

    await cancelOrder()(dispatch, () => ({ order: { order: { _id: '1' } } }));

    // push(...) from connected-react-router dispatches a plain action.
    expect(dispatch.mock.calls[0][0].type).toBe('@@router/CALL_HISTORY_METHOD');
    expect(lastRequestBody().variables.orderId).toBe('1');
  });

  it('handles a failed cancel', async () => {
    mock.onPost(GRAPHQL_URL).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await cancelOrder()(dispatch, () => ({ order: { order: { _id: '1' } } }));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
  });
});

describe('updateOrderItemStatus', () => {
  const getState = () => ({ order: { order: { _id: 'order-1', cartId: 'cart-1' } } });

  it('redirects to the orders list when the whole order gets cancelled', async () => {
    mock.onPost(GRAPHQL_URL).reply(200, {
      data: { updateOrderItemStatus: { orderCancelled: true, message: 'Order cancelled' } }
    });
    const dispatch = vi.fn();

    await updateOrderItemStatus('item-1', 'Cancelled')(dispatch, getState);

    const calls = dispatch.mock.calls.map(call => call[0]);
    expect(calls[0].type).toBe('@@router/CALL_HISTORY_METHOD');
    expect(calls[1]).toEqual(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
  });

  it('updates the item status and re-fetches the order without cancelling', async () => {
    mock.onPost(GRAPHQL_URL).reply(200, { data: { updateOrderItemStatus: { message: 'Updated' } } });
    const dispatch = vi.fn();

    await updateOrderItemStatus('item-1', 'Shipped')(dispatch, getState);

    const calls = dispatch.mock.calls.map(call => call[0]);
    expect(calls[0]).toEqual({ type: UPDATE_ORDER_STATUS, payload: { itemId: 'item-1', status: 'Shipped' } });
    expect(typeof calls[1]).toBe('function');
    expect(calls[2]).toEqual(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
  });

  it('handles a failed request', async () => {
    mock.onPost(GRAPHQL_URL).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await updateOrderItemStatus('item-1', 'Shipped')(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
  });
});

describe('addOrder', () => {
  it('places the order, redirects to the success page, and clears the cart', async () => {
    localStorage.setItem('cart_id', 'cart-1');
    mock.onPost(GRAPHQL_URL).reply(200, { data: { placeOrder: { order: { _id: 'order-1' } } } });
    const dispatch = vi.fn();

    await addOrder()(dispatch, () => ({ cart: { cartTotal: 20 } }));

    const calls = dispatch.mock.calls.map(call => call[0]);
    // push(...) is a plain action; clearCart() hands the mock dispatch a
    // thunk function (its own behavior is covered by Cart's own tests).
    expect(calls[0].type).toBe('@@router/CALL_HISTORY_METHOD');
    expect(typeof calls[1]).toBe('function');
  });

  it('does nothing when there is no server-side cart id', async () => {
    const dispatch = vi.fn();

    await addOrder()(dispatch, () => ({ cart: { cartTotal: 20 } }));

    expect(dispatch).not.toHaveBeenCalled();
  });

  it('handles a failed request', async () => {
    localStorage.setItem('cart_id', 'cart-1');
    mock.onPost(GRAPHQL_URL).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await addOrder()(dispatch, () => ({ cart: { cartTotal: 20 } }));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
  });
});

describe('placeOrder', () => {
  it('ensures a cart id then places the order when logged in with items in the cart', async () => {
    localStorage.setItem('token', 'Bearer abc');
    const dispatch = vi.fn(() => Promise.resolve());
    const getState = () => ({ cart: { cartItems: [{ _id: '1' }] } });

    placeOrder()(dispatch, getState);
    await flush();

    const calls = dispatch.mock.calls.map(call => call[0]);
    expect(typeof calls[0]).toBe('function'); // getCartId()
    expect(typeof calls[calls.length - 1]).toBe('function'); // toggleCart()
    // addOrder() is dispatched asynchronously, after the Promise.all(...).then(...).
    expect(calls.some(action => typeof action === 'function')).toBe(true);
  });

  it('only closes the cart when logged out', async () => {
    const dispatch = vi.fn();
    const getState = () => ({ cart: { cartItems: [{ _id: '1' }] } });

    placeOrder()(dispatch, getState);
    await flush();

    expect(dispatch).toHaveBeenCalledTimes(1);
  });

  it('only closes the cart when the cart is empty', async () => {
    localStorage.setItem('token', 'Bearer abc');
    const dispatch = vi.fn();
    const getState = () => ({ cart: { cartItems: [] } });

    placeOrder()(dispatch, getState);
    await flush();

    expect(dispatch).toHaveBeenCalledTimes(1);
  });
});
