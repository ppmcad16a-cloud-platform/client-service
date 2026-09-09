import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import {
  productChange,
  productEditChange,
  productShopChange,
  resetProduct,
  setProductLoading,
  filterProducts2,
  filterProducts,
  fetchStoreProduct,
  fetchProductsSelect,
  fetchProducts,
  fetchProduct,
  addProduct,
  updateProduct,
  activateProduct,
  deleteProduct
} from './actions';
import {
  FETCH_PRODUCTS,
  FETCH_STORE_PRODUCTS,
  FETCH_PRODUCT,
  FETCH_STORE_PRODUCT,
  PRODUCT_CHANGE,
  PRODUCT_EDIT_CHANGE,
  PRODUCT_SHOP_CHANGE,
  SET_PRODUCT_FORM_ERRORS,
  SET_PRODUCT_FORM_EDIT_ERRORS,
  RESET_PRODUCT,
  ADD_PRODUCT,
  REMOVE_PRODUCT,
  FETCH_PRODUCTS_SELECT,
  SET_PRODUCTS_LOADING,
  SET_ADVANCED_FILTERS
} from './constants';
import { API_URL, ROLES } from '../../constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

it('productChange builds a keyed payload', () => {
  expect(productChange('name', 'Widget')).toEqual({ type: PRODUCT_CHANGE, payload: { name: 'Widget' } });
});

it('productEditChange builds a keyed payload', () => {
  expect(productEditChange('name', 'Widget')).toEqual({ type: PRODUCT_EDIT_CHANGE, payload: { name: 'Widget' } });
});

it('productShopChange builds a keyed payload', () => {
  expect(productShopChange('quantity', 2)).toEqual({ type: PRODUCT_SHOP_CHANGE, payload: { quantity: 2 } });
});

it('resetProduct dispatches RESET_PRODUCT', async () => {
  const dispatch = vi.fn();
  await resetProduct()(dispatch, () => ({}));
  expect(dispatch).toHaveBeenCalledWith({ type: RESET_PRODUCT });
});

it('setProductLoading carries the loading flag', () => {
  expect(setProductLoading(true)).toEqual({ type: SET_PRODUCTS_LOADING, payload: true });
});

const advancedFilters = {
  name: 'shoes',
  category: 'cat1',
  brand: 'brand1',
  min: 0,
  max: 100,
  rating: 3,
  order: 0,
  currentPage: 2,
  limit: 20
};

describe('filterProducts2 (vestigial — not called anywhere in the app)', () => {
  it('sets advanced filters without calling the API', async () => {
    const dispatch = vi.fn();

    await filterProducts2('category', 'cat2')(dispatch, () => ({ product: { advancedFilters } }));

    expect(dispatch).toHaveBeenCalledWith({
      type: SET_ADVANCED_FILTERS,
      payload: expect.objectContaining({ category: 'cat2', brand: 'all' })
    });
  });
});

describe('filterProducts', () => {
  const getState = () => ({ product: { advancedFilters } });

  it.each([
    [undefined, undefined],
    ['category', 'cat2'],
    ['brand', 'brand2'],
    ['sorting', 0],
    ['sorting', 1],
    ['sorting', 2],
    ['sorting', 99],
    ['price', [10, 90]],
    ['rating', 4],
    ['pagination', 3],
    ['pagination', null]
  ])('filters/sorts store products by n=%s v=%s', async (n, v) => {
    mock.onGet(`${API_URL}/product/list`).reply(200, {
      products: [{ _id: '1' }],
      totalPages: 2,
      currentPage: 1,
      count: 10
    });
    const dispatch = vi.fn();

    await filterProducts(n, v)(dispatch, getState);

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toEqual([
      SET_PRODUCTS_LOADING,
      SET_ADVANCED_FILTERS,
      FETCH_STORE_PRODUCTS,
      SET_ADVANCED_FILTERS,
      SET_PRODUCTS_LOADING
    ]);
  });

  it('handles a failed request', async () => {
    mock.onGet(`${API_URL}/product/list`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await filterProducts()(dispatch, getState);

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toContain('RNS_SHOW_NOTIFICATION');
  });
});

describe('fetchStoreProduct', () => {
  it('fetches a store product by slug and stores its inventory', async () => {
    mock.onGet(`${API_URL}/product/item/widget`).reply(200, {
      product: { _id: '1', quantity: 5 }
    });
    const dispatch = vi.fn();

    await fetchStoreProduct('widget')(dispatch, () => ({}));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toEqual([SET_PRODUCTS_LOADING, FETCH_STORE_PRODUCT, SET_PRODUCTS_LOADING]);
    expect(dispatch.mock.calls[1][0].payload).toEqual({ _id: '1', quantity: 5, inventory: 5 });
  });

  it('handles a failed fetch', async () => {
    mock.onGet(`${API_URL}/product/item/widget`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await fetchStoreProduct('widget')(dispatch, () => ({}));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toContain('RNS_SHOW_NOTIFICATION');
  });
});

describe('fetchProductsSelect', () => {
  it('fetches products formatted for a select input', async () => {
    mock.onGet(`${API_URL}/product/list/select`).reply(200, {
      products: [{ _id: 'p1', name: 'Widget' }]
    });
    const dispatch = vi.fn();

    await fetchProductsSelect()(dispatch, () => ({}));

    expect(dispatch).toHaveBeenCalledWith({
      type: FETCH_PRODUCTS_SELECT,
      payload: [{ value: 'p1', label: 'Widget' }]
    });
  });

  it('handles a failed fetch', async () => {
    mock.onGet(`${API_URL}/product/list/select`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await fetchProductsSelect()(dispatch, () => ({}));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
  });
});

describe('fetchProducts', () => {
  it('fetches the dashboard product list, toggling loading around it', async () => {
    mock.onGet(`${API_URL}/product`).reply(200, { products: [{ _id: '1' }] });
    const dispatch = vi.fn();

    await fetchProducts()(dispatch, () => ({}));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toEqual([SET_PRODUCTS_LOADING, FETCH_PRODUCTS, SET_PRODUCTS_LOADING]);
  });

  it('handles a failed fetch', async () => {
    mock.onGet(`${API_URL}/product`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await fetchProducts()(dispatch, () => ({}));

    expect(dispatch.mock.calls.at(-1)[0]).toEqual({ type: SET_PRODUCTS_LOADING, payload: false });
  });
});

describe('fetchProduct', () => {
  it('fetches a product that has a brand and formats it for a select', async () => {
    mock.onGet(`${API_URL}/product/1`).reply(200, {
      product: { _id: '1', quantity: 5, brand: { _id: 'b1', name: 'Acme' } }
    });
    const dispatch = vi.fn();

    await fetchProduct('1')(dispatch, () => ({}));

    expect(dispatch).toHaveBeenCalledWith({
      type: FETCH_PRODUCT,
      payload: expect.objectContaining({
        inventory: 5,
        brand: { value: 'b1', label: 'Acme' }
      })
    });
  });

  it('fetches a product with no brand and formats an empty-option placeholder', async () => {
    mock.onGet(`${API_URL}/product/1`).reply(200, {
      product: { _id: '1', quantity: 5, brand: null }
    });
    const dispatch = vi.fn();

    await fetchProduct('1')(dispatch, () => ({}));

    expect(dispatch).toHaveBeenCalledWith({
      type: FETCH_PRODUCT,
      payload: expect.objectContaining({
        brand: { value: 0, label: 'No option selected' }
      })
    });
  });

  it('handles a failed fetch', async () => {
    mock.onGet(`${API_URL}/product/1`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await fetchProduct('1')(dispatch, () => ({}));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
  });
});

describe('addProduct', () => {
  const validFormData = {
    sku: 'ABC-123',
    name: 'Widget',
    description: 'A fine widget',
    quantity: '10',
    price: '9.99',
    isActive: true,
    imageUrl: 'http://example.com/x.png',
    taxable: { value: true, label: 'Yes' },
    brand: { value: 'b1', label: 'Acme' }
  };

  it('rejects invalid form data without calling the API', async () => {
    const dispatch = vi.fn();

    await addProduct()(dispatch, () => ({
      product: {
        productFormData: {
          taxable: { value: false, label: 'No' },
          brand: { value: 'b1', label: 'Acme' }
        }
      },
      account: { user: { role: ROLES.Admin } },
      brand: { brandsSelect: [] }
    }));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: SET_PRODUCT_FORM_ERRORS }));
  });

  it('creates the product as an admin/non-merchant, resets the form, and navigates back', async () => {
    mock.onPost(`${API_URL}/product/add`).reply(200, {
      success: true,
      message: 'Added!',
      product: { _id: '1' }
    });
    const dispatch = vi.fn();

    await addProduct()(dispatch, () => ({
      product: { productFormData: validFormData },
      account: { user: { role: ROLES.Admin } },
      brand: { brandsSelect: [] }
    }));

    const calls = dispatch.mock.calls.map(call => call[0]);
    expect(calls[0]).toEqual(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
    expect(calls[1]).toEqual({ type: ADD_PRODUCT, payload: { _id: '1' } });
    // dispatch(resetProduct()) hands the mock dispatch a thunk function —
    // resetProduct's own behavior is already covered by its own test above.
    expect(typeof calls[2]).toBe('function');
    expect(calls[3].type).toBe('@@router/CALL_HISTORY_METHOD');
  });

  it("creates the product as a merchant, forcing the merchant's own brand", async () => {
    mock.onPost(`${API_URL}/product/add`).reply(200, {
      success: true,
      message: 'Added!',
      product: { _id: '1' }
    });
    const dispatch = vi.fn();

    await addProduct()(dispatch, () => ({
      product: { productFormData: validFormData },
      account: { user: { role: ROLES.Merchant } },
      brand: { brandsSelect: [{ value: 0, label: 'No option selected' }, { value: 'merchant-brand', label: 'Mine' }] }
    }));

    const request = JSON.parse(mock.history.post[0].data);
    expect(request.brand).toBe('merchant-brand');
  });

  it('does not show a success toast when the server reports failure', async () => {
    mock.onPost(`${API_URL}/product/add`).reply(200, { success: false, message: 'Nope' });
    const dispatch = vi.fn();

    await addProduct()(dispatch, () => ({
      product: { productFormData: validFormData },
      account: { user: { role: ROLES.Admin } },
      brand: { brandsSelect: [] }
    }));

    expect(dispatch).not.toHaveBeenCalled();
  });

  it('handles a failed request', async () => {
    mock.onPost(`${API_URL}/product/add`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await addProduct()(dispatch, () => ({
      product: { productFormData: validFormData },
      account: { user: { role: ROLES.Admin } },
      brand: { brandsSelect: [] }
    }));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
  });
});

describe('updateProduct', () => {
  const validProduct = {
    _id: '1',
    name: 'Widget',
    sku: 'ABC-123',
    slug: 'widget',
    description: 'A fine widget',
    quantity: '10',
    price: '9.99',
    taxable: true,
    imageUrl: 'http://example.com/x.png',
    brand: { value: 'b1', label: 'Acme' }
  };

  it('rejects invalid form data without calling the API', async () => {
    const dispatch = vi.fn();

    await updateProduct()(dispatch, () => ({
      product: { product: { brand: { value: 'b1', label: 'Acme' } } }
    }));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: SET_PRODUCT_FORM_EDIT_ERRORS }));
  });

  it('updates the product and stays on the edit page (no navigation)', async () => {
    mock.onPut(`${API_URL}/product/1`).reply(200, { success: true, message: 'Updated!' });
    const dispatch = vi.fn();

    await updateProduct()(dispatch, () => ({ product: { product: validProduct } }));

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
  });

  it('does not show a success toast when the server reports failure', async () => {
    mock.onPut(`${API_URL}/product/1`).reply(200, { success: false, message: 'Nope' });
    const dispatch = vi.fn();

    await updateProduct()(dispatch, () => ({ product: { product: validProduct } }));

    expect(dispatch).not.toHaveBeenCalled();
  });

  it('handles a failed request', async () => {
    mock.onPut(`${API_URL}/product/1`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await updateProduct()(dispatch, () => ({ product: { product: validProduct } }));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
  });
});

describe('activateProduct', () => {
  it('shows a success toast after a successful (de)activation', async () => {
    mock.onPut(`${API_URL}/product/1/active`).reply(200, { success: true, message: 'Updated!' });
    const dispatch = vi.fn();

    await activateProduct('1', false)(dispatch, () => ({}));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
  });

  it('does not show a toast when the server reports failure', async () => {
    mock.onPut(`${API_URL}/product/1/active`).reply(200, { success: false, message: 'Nope' });
    const dispatch = vi.fn();

    await activateProduct('1', false)(dispatch, () => ({}));

    expect(dispatch).not.toHaveBeenCalled();
  });

  it('handles a failed request', async () => {
    mock.onPut(`${API_URL}/product/1/active`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await activateProduct('1', false)(dispatch, () => ({}));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
  });
});

describe('deleteProduct', () => {
  it('deletes the product and navigates back', async () => {
    mock.onDelete(`${API_URL}/product/delete/1`).reply(200, { success: true, message: 'Deleted!' });
    const dispatch = vi.fn();

    await deleteProduct('1')(dispatch, () => ({}));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toEqual(['RNS_SHOW_NOTIFICATION', REMOVE_PRODUCT, '@@router/CALL_HISTORY_METHOD']);
  });

  it('does not navigate back when the server reports failure', async () => {
    mock.onDelete(`${API_URL}/product/delete/1`).reply(200, { success: false, message: 'Nope' });
    const dispatch = vi.fn();

    await deleteProduct('1')(dispatch, () => ({}));

    expect(dispatch).not.toHaveBeenCalled();
  });

  it('handles a failed delete', async () => {
    mock.onDelete(`${API_URL}/product/delete/1`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await deleteProduct('1')(dispatch, () => ({}));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
  });
});
