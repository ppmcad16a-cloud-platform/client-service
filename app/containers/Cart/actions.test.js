import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import {
  handleAddToCart,
  handleRemoveFromCart,
  calculateCartTotal,
  handleCart,
  handleCheckout,
  handleShopping,
  getCartId,
  setCartId,
  clearCart
} from './actions';
import {
  HANDLE_CART,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  HANDLE_CART_TOTAL,
  SET_CART_ID,
  CLEAR_CART
} from './constants';
import { SET_PRODUCT_SHOP_FORM_ERRORS, RESET_PRODUCT_SHOP } from '../Product/constants';
import { TOGGLE_CART } from '../Navigation/constants';
import { API_URL, CART_ID, CART_ITEMS, CART_TOTAL } from '../../constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
  localStorage.clear();
});

describe('handleAddToCart', () => {
  const getState = inventory => () => ({
    product: {
      productShopData: { quantity: 1 },
      storeProduct: { inventory }
    }
  });

  it('rejects a quantity above the inventory-scaled cap', () => {
    const dispatch = vi.fn();
    // inventory <= 25 caps at 1 unit; requesting 2 should fail.
    const product = { _id: '1', price: 10 };

    handleAddToCart(product)(
      dispatch,
      () => ({ product: { productShopData: { quantity: 2 }, storeProduct: { inventory: 10 } } })
    );

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: SET_PRODUCT_SHOP_FORM_ERRORS }));
  });

  it.each([
    [10, 1],
    [50, 1],
    [200, 1],
    [1000, 1]
  ])('adds the product to the cart and localStorage across every inventory tier (inventory=%i)', (inventory, quantity) => {
    const dispatch = vi.fn();
    const product = { _id: '1', price: 10 };

    handleAddToCart(product)(dispatch, getState(inventory));

    const types = dispatch.mock.calls.map(call => call[0]?.type ?? typeof call[0]);
    // dispatch(calculateCartTotal()) hands the mock dispatch a thunk
    // function; dispatch(toggleCart()) dispatches a plain TOGGLE_CART action
    // (toggleCart is NOT a thunk, unlike most of the other duck's actions).
    expect(types).toEqual([RESET_PRODUCT_SHOP, ADD_TO_CART, 'function', TOGGLE_CART]);
    expect(JSON.parse(localStorage.getItem(CART_ITEMS))).toEqual([
      expect.objectContaining({ _id: '1', quantity, totalPrice: 10 * quantity })
    ]);
  });

  it('appends to existing cart items in localStorage', () => {
    localStorage.setItem(CART_ITEMS, JSON.stringify([{ _id: 'existing' }]));
    const dispatch = vi.fn();
    const product = { _id: '1', price: 10 };

    handleAddToCart(product)(dispatch, getState(1000));

    const stored = JSON.parse(localStorage.getItem(CART_ITEMS));
    expect(stored).toHaveLength(2);
    expect(stored[0]).toEqual({ _id: 'existing' });
  });
});

describe('handleRemoveFromCart', () => {
  it('removes the item from Redux and localStorage without re-toggling the cart', () => {
    localStorage.setItem(CART_ITEMS, JSON.stringify([{ _id: '1' }, { _id: '2' }]));
    const dispatch = vi.fn();

    handleRemoveFromCart({ _id: '1' })(dispatch, () => ({}));

    expect(JSON.parse(localStorage.getItem(CART_ITEMS))).toEqual([{ _id: '2' }]);
    const types = dispatch.mock.calls.map(call => call[0].type ?? typeof call[0]);
    expect(dispatch.mock.calls[0][0]).toEqual({ type: REMOVE_FROM_CART, payload: { _id: '1' } });
    expect(typeof dispatch.mock.calls[1][0]).toBe('function');
    expect(dispatch.mock.calls).toHaveLength(2);
  });
});

describe('calculateCartTotal', () => {
  it('sums price*quantity across cart items and stores it', () => {
    const dispatch = vi.fn();
    const getState = () => ({
      cart: { cartItems: [{ price: 10, quantity: 2 }, { price: 5, quantity: 1 }] }
    });

    calculateCartTotal()(dispatch, getState);

    expect(localStorage.getItem(CART_TOTAL)).toBe('25');
    expect(dispatch).toHaveBeenCalledWith({ type: HANDLE_CART_TOTAL, payload: 25 });
  });
});

describe('handleCart', () => {
  it('hydrates cart state from localStorage when items exist', () => {
    localStorage.setItem(CART_ITEMS, JSON.stringify([{ _id: '1', price: 10, quantity: 1 }]));
    localStorage.setItem(CART_TOTAL, '10');
    localStorage.setItem(CART_ID, 'cart-1');
    const dispatch = vi.fn();

    handleCart()(dispatch, () => ({ cart: { cartItems: [{ price: 10, quantity: 1 }] } }));

    expect(dispatch.mock.calls[0][0].type).toBe(HANDLE_CART);
    expect(typeof dispatch.mock.calls[1][0]).toBe('function');
  });

  it('does nothing when there are no stored cart items', () => {
    const dispatch = vi.fn();

    handleCart()(dispatch, () => ({}));

    expect(dispatch).not.toHaveBeenCalled();
  });
});

describe('handleCheckout', () => {
  it('closes the cart, redirects to login, and shows a toast', () => {
    const dispatch = vi.fn();

    handleCheckout()(dispatch, () => ({}));

    const calls = dispatch.mock.calls.map(call => call[0]);
    // toggleCart() is a plain action creator (not a thunk); push() from
    // connected-react-router dispatches a plain '@@router/...' action too.
    expect(calls[0]).toEqual({ type: TOGGLE_CART });
    expect(calls[1].type).toBe('@@router/CALL_HISTORY_METHOD');
    expect(calls[2]).toEqual(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
  });
});

describe('handleShopping', () => {
  it('redirects to /shop and closes the cart', () => {
    const dispatch = vi.fn();

    handleShopping()(dispatch, () => ({}));

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch.mock.calls[0][0].type).toBe('@@router/CALL_HISTORY_METHOD');
    expect(dispatch.mock.calls[1][0]).toEqual({ type: TOGGLE_CART });
  });
});

describe('getCartId', () => {
  it('does nothing when a cart id is already stored', async () => {
    localStorage.setItem(CART_ID, 'existing');
    const dispatch = vi.fn();

    await getCartId()(dispatch, () => ({ cart: { cartItems: [] } }));

    expect(dispatch).not.toHaveBeenCalled();
  });

  it('creates a server cart and stores the returned id when none exists', async () => {
    mock.onPost(`${API_URL}/graphql`).reply(200, { data: { addCart: { cartId: 'new-cart-id' } } });
    const dispatch = vi.fn();

    await getCartId()(dispatch, () => ({
      cart: { cartItems: [{ _id: '1', quantity: 1, price: 10, taxable: false }] }
    }));

    expect(typeof dispatch.mock.calls[0][0]).toBe('function');
  });

  it('handles a failed request', async () => {
    mock.onPost(`${API_URL}/graphql`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await getCartId()(dispatch, () => ({ cart: { cartItems: [] } }));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
  });
});

describe('setCartId', () => {
  it('stores the cart id and dispatches SET_CART_ID', () => {
    const dispatch = vi.fn();

    setCartId('abc')(dispatch, () => ({}));

    expect(localStorage.getItem(CART_ID)).toBe('abc');
    expect(dispatch).toHaveBeenCalledWith({ type: SET_CART_ID, payload: 'abc' });
  });
});

describe('clearCart', () => {
  it('removes all cart localStorage keys and dispatches CLEAR_CART', () => {
    localStorage.setItem(CART_ITEMS, '[]');
    localStorage.setItem(CART_TOTAL, '0');
    localStorage.setItem(CART_ID, 'x');
    const dispatch = vi.fn();

    clearCart()(dispatch, () => ({}));

    expect(localStorage.getItem(CART_ITEMS)).toBeNull();
    expect(localStorage.getItem(CART_TOTAL)).toBeNull();
    expect(localStorage.getItem(CART_ID)).toBeNull();
    expect(dispatch).toHaveBeenCalledWith({ type: CLEAR_CART });
  });
});
