import categoryReducer from './reducer';
import {
  FETCH_CATEGORIES,
  FETCH_STORE_CATEGORIES,
  FETCH_CATEGORY,
  CATEGORY_CHANGE,
  CATEGORY_EDIT_CHANGE,
  SET_CATEGORY_FORM_ERRORS,
  SET_CATEGORY_FORM_EDIT_ERRORS,
  ADD_CATEGORY,
  REMOVE_CATEGORY,
  SET_CATEGORIES_LOADING,
  RESET_CATEGORY
} from './constants';

const initialState = {
  categories: [],
  storeCategories: [],
  category: { _id: '' },
  categoryFormData: { name: '', description: '', products: [], isActive: true },
  formErrors: {},
  editFormErrors: {},
  isLoading: false
};

it('returns the initial state by default', () => {
  expect(categoryReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
});

it('stores the dashboard category list', () => {
  const categories = [{ _id: '1' }];
  expect(categoryReducer(initialState, { type: FETCH_CATEGORIES, payload: categories }).categories).toBe(categories);
});

it('stores the storefront category list', () => {
  const categories = [{ _id: '1' }];
  expect(
    categoryReducer(initialState, { type: FETCH_STORE_CATEGORIES, payload: categories }).storeCategories
  ).toBe(categories);
});

it('stores a single fetched category', () => {
  const state = categoryReducer(initialState, {
    type: FETCH_CATEGORY,
    payload: { _id: '1', name: 'Gadgets' }
  });
  expect(state.category).toEqual({ _id: '1', name: 'Gadgets' });
});

it('appends a newly-added category', () => {
  const state = categoryReducer(
    { ...initialState, categories: [{ _id: '1' }] },
    { type: ADD_CATEGORY, payload: { _id: '2' } }
  );
  expect(state.categories).toEqual([{ _id: '1' }, { _id: '2' }]);
});

it('removes a category by id', () => {
  const state = categoryReducer(
    { ...initialState, categories: [{ _id: '1' }, { _id: '2' }] },
    { type: REMOVE_CATEGORY, payload: '1' }
  );
  expect(state.categories).toEqual([{ _id: '2' }]);
});

it('merges a form change into categoryFormData', () => {
  const state = categoryReducer(initialState, { type: CATEGORY_CHANGE, payload: { name: 'Gadgets' } });
  expect(state.categoryFormData.name).toBe('Gadgets');
});

it('merges an edit-form change into category', () => {
  const state = categoryReducer(initialState, { type: CATEGORY_EDIT_CHANGE, payload: { name: 'Gadgets' } });
  expect(state.category.name).toBe('Gadgets');
});

it('sets add-form errors', () => {
  const errors = { name: ['required'] };
  expect(categoryReducer(initialState, { type: SET_CATEGORY_FORM_ERRORS, payload: errors }).formErrors).toBe(errors);
});

it('sets edit-form errors', () => {
  const errors = { name: ['required'] };
  expect(
    categoryReducer(initialState, { type: SET_CATEGORY_FORM_EDIT_ERRORS, payload: errors }).editFormErrors
  ).toBe(errors);
});

it('sets the loading flag', () => {
  expect(categoryReducer(initialState, { type: SET_CATEGORIES_LOADING, payload: true }).isLoading).toBe(true);
});

it('resets the form data, category, and errors', () => {
  const dirty = {
    ...initialState,
    categoryFormData: { name: 'Gadgets', description: 'x', products: ['1'], isActive: false },
    category: { _id: '1' },
    formErrors: { name: ['required'] },
    editFormErrors: { name: ['required'] }
  };
  const state = categoryReducer(dirty, { type: RESET_CATEGORY });
  expect(state.categoryFormData).toEqual(initialState.categoryFormData);
  expect(state.category).toEqual({ _id: '' });
  expect(state.formErrors).toEqual({});
  expect(state.editFormErrors).toEqual({});
});

it('returns the existing state for an unknown action', () => {
  expect(categoryReducer(initialState, { type: 'UNKNOWN' })).toBe(initialState);
});
