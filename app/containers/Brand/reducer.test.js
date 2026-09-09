import brandReducer from './reducer';
import {
  FETCH_BRANDS,
  FETCH_STORE_BRANDS,
  FETCH_BRAND,
  BRAND_CHANGE,
  BRAND_EDIT_CHANGE,
  SET_BRAND_FORM_ERRORS,
  SET_BRAND_FORM_EDIT_ERRORS,
  ADD_BRAND,
  REMOVE_BRAND,
  FETCH_BRANDS_SELECT,
  RESET_BRAND,
  SET_BRANDS_LOADING
} from './constants';

const initialState = {
  brands: [],
  storeBrands: [],
  brand: { name: '', description: '' },
  brandsSelect: [],
  brandFormData: { name: '', description: '', isActive: true },
  formErrors: {},
  editFormErrors: {},
  isLoading: false
};

it('returns the initial state by default', () => {
  expect(brandReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
});

it('stores the dashboard brand list', () => {
  const brands = [{ _id: '1' }];
  expect(brandReducer(initialState, { type: FETCH_BRANDS, payload: brands }).brands).toBe(brands);
});

it('stores the storefront brand list', () => {
  const brands = [{ _id: '1' }];
  expect(
    brandReducer(initialState, { type: FETCH_STORE_BRANDS, payload: brands }).storeBrands
  ).toBe(brands);
});

it('stores a single fetched brand and clears edit errors', () => {
  const state = brandReducer(
    { ...initialState, editFormErrors: { name: ['required'] } },
    { type: FETCH_BRAND, payload: { _id: '1', name: 'Nike' } }
  );
  expect(state.brand).toEqual({ _id: '1', name: 'Nike' });
  expect(state.editFormErrors).toEqual({});
});

it('stores the brand select options', () => {
  const options = [{ value: '1', label: 'Nike' }];
  expect(
    brandReducer(initialState, { type: FETCH_BRANDS_SELECT, payload: options }).brandsSelect
  ).toBe(options);
});

it('appends a newly-added brand', () => {
  const state = brandReducer(
    { ...initialState, brands: [{ _id: '1' }] },
    { type: ADD_BRAND, payload: { _id: '2' } }
  );
  expect(state.brands).toEqual([{ _id: '1' }, { _id: '2' }]);
});

it('removes a brand by id', () => {
  const state = brandReducer(
    { ...initialState, brands: [{ _id: '1' }, { _id: '2' }] },
    { type: REMOVE_BRAND, payload: '1' }
  );
  expect(state.brands).toEqual([{ _id: '2' }]);
});

it('merges a form change into brandFormData', () => {
  const state = brandReducer(initialState, { type: BRAND_CHANGE, payload: { name: 'Nike' } });
  expect(state.brandFormData.name).toBe('Nike');
});

it('merges an edit-form change into brand', () => {
  const state = brandReducer(initialState, { type: BRAND_EDIT_CHANGE, payload: { name: 'Nike' } });
  expect(state.brand.name).toBe('Nike');
});

it('sets add-form errors', () => {
  const errors = { name: ['required'] };
  expect(brandReducer(initialState, { type: SET_BRAND_FORM_ERRORS, payload: errors }).formErrors).toBe(errors);
});

it('sets edit-form errors', () => {
  const errors = { name: ['required'] };
  expect(
    brandReducer(initialState, { type: SET_BRAND_FORM_EDIT_ERRORS, payload: errors }).editFormErrors
  ).toBe(errors);
});

it('sets the loading flag', () => {
  expect(brandReducer(initialState, { type: SET_BRANDS_LOADING, payload: true }).isLoading).toBe(true);
});

it('resets the add-form data and errors', () => {
  const dirty = {
    ...initialState,
    brandFormData: { name: 'Nike', description: 'x', isActive: false },
    formErrors: { name: ['required'] }
  };
  const state = brandReducer(dirty, { type: RESET_BRAND });
  expect(state.brandFormData).toEqual(initialState.brandFormData);
  expect(state.formErrors).toEqual({});
});

it('returns the existing state for an unknown action', () => {
  expect(brandReducer(initialState, { type: 'UNKNOWN' })).toBe(initialState);
});
