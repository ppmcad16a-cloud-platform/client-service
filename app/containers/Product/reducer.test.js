import productReducer from './reducer';
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
  SET_PRODUCT_SHOP_FORM_ERRORS,
  RESET_PRODUCT,
  RESET_PRODUCT_SHOP,
  ADD_PRODUCT,
  REMOVE_PRODUCT,
  FETCH_PRODUCTS_SELECT,
  SET_PRODUCTS_LOADING,
  SET_ADVANCED_FILTERS,
  RESET_ADVANCED_FILTERS
} from './constants';

const initialProductFormData = {
  sku: '',
  name: '',
  description: '',
  quantity: 1,
  price: 1,
  isActive: true,
  imageUrl: '',
  taxable: { value: 0, label: 'No' },
  brand: { value: 0, label: 'No Options Selected' }
};

const initialAdvancedFilters = {
  name: 'all',
  category: 'all',
  brand: 'all',
  min: 1,
  max: 2500,
  rating: 0,
  order: 0,
  totalPages: 1,
  currentPage: 1,
  count: 0,
  limit: 10
};

const initialState = {
  products: [],
  storeProducts: [],
  product: { _id: '' },
  storeProduct: {},
  productsSelect: [],
  productFormData: initialProductFormData,
  isLoading: false,
  productShopData: { quantity: 1 },
  formErrors: {},
  editFormErrors: {},
  shopFormErrors: {},
  advancedFilters: initialAdvancedFilters
};

it('returns the initial state by default', () => {
  expect(productReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
});

it('stores the dashboard product list', () => {
  const products = [{ _id: '1' }];
  expect(productReducer(initialState, { type: FETCH_PRODUCTS, payload: products }).products).toBe(products);
});

it('stores the storefront product list', () => {
  const products = [{ _id: '1' }];
  expect(
    productReducer(initialState, { type: FETCH_STORE_PRODUCTS, payload: products }).storeProducts
  ).toBe(products);
});

it('stores a single fetched product and clears edit errors', () => {
  const state = productReducer(
    { ...initialState, editFormErrors: { name: ['required'] } },
    { type: FETCH_PRODUCT, payload: { _id: '1', name: 'Widget' } }
  );
  expect(state.product).toEqual({ _id: '1', name: 'Widget' });
  expect(state.editFormErrors).toEqual({});
});

it('stores a fetched storefront product and resets shop form state', () => {
  const dirty = {
    ...initialState,
    productShopData: { quantity: 5 },
    shopFormErrors: { quantity: ['max'] }
  };
  const state = productReducer(dirty, {
    type: FETCH_STORE_PRODUCT,
    payload: { _id: '1', name: 'Widget' }
  });
  expect(state.storeProduct).toEqual({ _id: '1', name: 'Widget' });
  expect(state.productShopData).toEqual({ quantity: 1 });
  expect(state.shopFormErrors).toEqual({});
});

it('sets the loading flag', () => {
  expect(productReducer(initialState, { type: SET_PRODUCTS_LOADING, payload: true }).isLoading).toBe(true);
});

it('stores the product select options', () => {
  const options = [{ value: '1', label: 'Widget' }];
  expect(
    productReducer(initialState, { type: FETCH_PRODUCTS_SELECT, payload: options }).productsSelect
  ).toBe(options);
});

it('appends a newly-added product', () => {
  const state = productReducer(
    { ...initialState, products: [{ _id: '1' }] },
    { type: ADD_PRODUCT, payload: { _id: '2' } }
  );
  expect(state.products).toEqual([{ _id: '1' }, { _id: '2' }]);
});

it('removes a product by id', () => {
  const state = productReducer(
    { ...initialState, products: [{ _id: '1' }, { _id: '2' }] },
    { type: REMOVE_PRODUCT, payload: '1' }
  );
  expect(state.products).toEqual([{ _id: '2' }]);
});

it('merges a form change into productFormData', () => {
  const state = productReducer(initialState, { type: PRODUCT_CHANGE, payload: { name: 'Widget' } });
  expect(state.productFormData.name).toBe('Widget');
});

it('merges an edit-form change into product', () => {
  const state = productReducer(initialState, { type: PRODUCT_EDIT_CHANGE, payload: { name: 'Widget' } });
  expect(state.product.name).toBe('Widget');
});

it('merges a shop-form change into productShopData', () => {
  const state = productReducer(initialState, { type: PRODUCT_SHOP_CHANGE, payload: { quantity: 3 } });
  expect(state.productShopData.quantity).toBe(3);
});

it('sets add-form errors', () => {
  const errors = { name: ['required'] };
  expect(productReducer(initialState, { type: SET_PRODUCT_FORM_ERRORS, payload: errors }).formErrors).toBe(errors);
});

it('sets edit-form errors', () => {
  const errors = { name: ['required'] };
  expect(
    productReducer(initialState, { type: SET_PRODUCT_FORM_EDIT_ERRORS, payload: errors }).editFormErrors
  ).toBe(errors);
});

it('sets shop-form errors', () => {
  const errors = { quantity: ['max'] };
  expect(
    productReducer(initialState, { type: SET_PRODUCT_SHOP_FORM_ERRORS, payload: errors }).shopFormErrors
  ).toBe(errors);
});

it('resets the add-form data, product, and errors', () => {
  const dirty = {
    ...initialState,
    productFormData: { ...initialProductFormData, name: 'Widget' },
    product: { _id: '1' },
    formErrors: { name: ['required'] }
  };
  const state = productReducer(dirty, { type: RESET_PRODUCT });
  expect(state.productFormData).toEqual(initialProductFormData);
  expect(state.product).toEqual({ _id: '' });
  expect(state.formErrors).toEqual({});
});

it('resets the shop-form data and errors', () => {
  const dirty = {
    ...initialState,
    productShopData: { quantity: 5 },
    shopFormErrors: { quantity: ['max'] }
  };
  const state = productReducer(dirty, { type: RESET_PRODUCT_SHOP });
  expect(state.productShopData).toEqual({ quantity: 1 });
  expect(state.shopFormErrors).toEqual({});
});

it('merges advanced filters', () => {
  const state = productReducer(initialState, { type: SET_ADVANCED_FILTERS, payload: { currentPage: 2 } });
  expect(state.advancedFilters).toEqual({ ...initialAdvancedFilters, currentPage: 2 });
});

it('resets advanced filters back to defaults', () => {
  const dirty = { ...initialState, advancedFilters: { ...initialAdvancedFilters, currentPage: 5 } };
  const state = productReducer(dirty, { type: RESET_ADVANCED_FILTERS });
  expect(state.advancedFilters).toEqual(initialAdvancedFilters);
});

it('returns the existing state for an unknown action', () => {
  expect(productReducer(initialState, { type: 'UNKNOWN' })).toBe(initialState);
});
