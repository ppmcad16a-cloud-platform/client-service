import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import {
  categoryChange,
  categoryEditChange,
  categorySelect,
  resetCategory,
  fetchStoreCategories,
  fetchCategories,
  fetchCategory,
  addCategory,
  updateCategory,
  activateCategory,
  deleteCategory
} from './actions';
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
import { API_URL } from '../../constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

it('categoryChange builds a keyed payload', () => {
  expect(categoryChange('name', 'Gadgets')).toEqual({ type: CATEGORY_CHANGE, payload: { name: 'Gadgets' } });
});

it('categoryEditChange builds a keyed payload', () => {
  expect(categoryEditChange('name', 'Gadgets')).toEqual({
    type: CATEGORY_EDIT_CHANGE,
    payload: { name: 'Gadgets' }
  });
});

it('categorySelect throws (existing bug: CATEGORY_SELECT is never imported into scope); never actually called anywhere in the app', () => {
  expect(() => categorySelect('x')).toThrow(ReferenceError);
});

it('resetCategory dispatches RESET_CATEGORY', async () => {
  const dispatch = vi.fn();
  await resetCategory()(dispatch, () => ({}));
  expect(dispatch).toHaveBeenCalledWith({ type: RESET_CATEGORY });
});

describe('fetchStoreCategories', () => {
  it('fetches the storefront category list', async () => {
    mock.onGet(`${API_URL}/category/list`).reply(200, { categories: [{ _id: '1' }] });
    const dispatch = vi.fn();

    await fetchStoreCategories()(dispatch, () => ({}));

    expect(dispatch).toHaveBeenCalledWith({ type: FETCH_STORE_CATEGORIES, payload: [{ _id: '1' }] });
  });

  it('handles a failed fetch', async () => {
    mock.onGet(`${API_URL}/category/list`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await fetchStoreCategories()(dispatch, () => ({}));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
  });
});

describe('fetchCategories', () => {
  it('fetches the dashboard category list, toggling loading around it', async () => {
    mock.onGet(`${API_URL}/category`).reply(200, { categories: [{ _id: '1' }] });
    const dispatch = vi.fn();

    await fetchCategories()(dispatch, () => ({}));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toEqual([SET_CATEGORIES_LOADING, FETCH_CATEGORIES, SET_CATEGORIES_LOADING]);
  });

  it('handles a failed fetch', async () => {
    mock.onGet(`${API_URL}/category`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await fetchCategories()(dispatch, () => ({}));

    expect(dispatch.mock.calls.at(-1)[0]).toEqual({ type: SET_CATEGORIES_LOADING, payload: false });
  });
});

describe('fetchCategory', () => {
  it('fetches a single category and formats its products for a select', async () => {
    mock.onGet(`${API_URL}/category/1`).reply(200, {
      category: { _id: '1', products: [{ _id: 'p1', name: 'Widget' }] }
    });
    const dispatch = vi.fn();

    await fetchCategory('1')(dispatch, () => ({}));

    expect(dispatch).toHaveBeenCalledWith({
      type: FETCH_CATEGORY,
      payload: { _id: '1', products: [{ value: 'p1', label: 'Widget' }] }
    });
  });

  it('handles a failed fetch', async () => {
    mock.onGet(`${API_URL}/category/1`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await fetchCategory('1')(dispatch, () => ({}));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
  });
});

describe('addCategory', () => {
  const validForm = { name: 'Gadgets', description: 'Tech', products: [{ value: 'p1', label: 'Widget' }] };

  it('rejects invalid form data without calling the API', async () => {
    const dispatch = vi.fn();

    await addCategory()(dispatch, () => ({ category: { categoryFormData: {} } }));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: SET_CATEGORY_FORM_ERRORS }));
  });

  it('creates the category, resets the form, and navigates back', async () => {
    mock.onPost(`${API_URL}/category/add`).reply(200, {
      success: true,
      message: 'Added!',
      category: { _id: '1' }
    });
    const dispatch = vi.fn();

    await addCategory()(dispatch, () => ({ category: { categoryFormData: validForm } }));

    // dispatch(resetCategory()) hands the mock dispatch a thunk function —
    // real thunk middleware would recurse into it and dispatch
    // RESET_CATEGORY, but that's resetCategory's own concern, already
    // covered by its own dedicated test above.
    const calls = dispatch.mock.calls.map(call => call[0]);
    expect(calls[0]).toEqual(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
    expect(calls[1]).toEqual({ type: ADD_CATEGORY, payload: { _id: '1' } });
    expect(typeof calls[2]).toBe('function');
    expect(calls[3].type).toBe('@@router/CALL_HISTORY_METHOD');
  });

  it('handles a failed create', async () => {
    mock.onPost(`${API_URL}/category/add`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await addCategory()(dispatch, () => ({ category: { categoryFormData: validForm } }));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
  });
});

describe('updateCategory', () => {
  const category = {
    _id: '1',
    name: 'Gadgets',
    slug: 'gadgets',
    description: 'Tech',
    products: [{ value: 'p1', label: 'Widget' }]
  };

  it('rejects invalid form data without calling the API', async () => {
    const dispatch = vi.fn();

    await updateCategory()(dispatch, () => ({ category: { category: {} } }));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: SET_CATEGORY_FORM_EDIT_ERRORS }));
  });

  it('updates the category, resets the form, and navigates back', async () => {
    mock.onPut(`${API_URL}/category/1`).reply(200, { success: true, message: 'Updated!' });
    const dispatch = vi.fn();

    await updateCategory()(dispatch, () => ({ category: { category } }));

    const calls = dispatch.mock.calls.map(call => call[0]);
    expect(calls[0]).toEqual(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
    // dispatch(resetCategory()) hands the mock dispatch a thunk function —
    // see the note in the addCategory test above.
    expect(typeof calls[1]).toBe('function');
    expect(calls[2].type).toBe('@@router/CALL_HISTORY_METHOD');
  });

  it('fails validation when products is left unset (products && unformatSelectOptions(products) short-circuits to undefined, which then fails the required rule)', async () => {
    const dispatch = vi.fn();

    await updateCategory()(dispatch, () => ({
      category: { category: { ...category, products: undefined } }
    }));

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: SET_CATEGORY_FORM_EDIT_ERRORS })
    );
  });

  it('handles a failed update', async () => {
    mock.onPut(`${API_URL}/category/1`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await updateCategory()(dispatch, () => ({ category: { category } }));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
  });
});

describe('activateCategory', () => {
  it('shows a success toast after a successful (de)activation', async () => {
    mock.onPut(`${API_URL}/category/1/active`).reply(200, { success: true, message: 'Updated!' });
    const dispatch = vi.fn();

    await activateCategory('1', false)(dispatch, () => ({}));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
  });

  it('handles a failed request', async () => {
    mock.onPut(`${API_URL}/category/1/active`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await activateCategory('1', false)(dispatch, () => ({}));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
  });
});

describe('deleteCategory', () => {
  it('deletes the category and navigates back', async () => {
    mock.onDelete(`${API_URL}/category/delete/1`).reply(200, { success: true, message: 'Deleted!' });
    const dispatch = vi.fn();

    await deleteCategory('1')(dispatch, () => ({}));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toEqual(['RNS_SHOW_NOTIFICATION', REMOVE_CATEGORY, '@@router/CALL_HISTORY_METHOD']);
  });

  it('handles a failed delete', async () => {
    mock.onDelete(`${API_URL}/category/delete/1`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await deleteCategory('1')(dispatch, () => ({}));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
  });
});
