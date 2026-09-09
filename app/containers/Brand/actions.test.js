import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import {
  brandChange,
  brandEditChange,
  fetchStoreBrands,
  fetchBrands,
  fetchBrand,
  fetchBrandsSelect,
  addBrand,
  updateBrand,
  activateBrand,
  deleteBrand
} from './actions';
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
  SET_BRANDS_LOADING,
  RESET_BRAND
} from './constants';
import { API_URL } from '../../constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

it('brandChange builds a keyed payload', () => {
  expect(brandChange('name', 'Nike')).toEqual({ type: BRAND_CHANGE, payload: { name: 'Nike' } });
});

it('brandEditChange builds a keyed payload', () => {
  expect(brandEditChange('name', 'Nike')).toEqual({ type: BRAND_EDIT_CHANGE, payload: { name: 'Nike' } });
});

describe('fetchStoreBrands', () => {
  it('fetches the storefront brand list', async () => {
    mock.onGet(`${API_URL}/brand/list`).reply(200, { brands: [{ _id: '1' }] });
    const dispatch = vi.fn();

    await fetchStoreBrands()(dispatch, () => ({}));

    expect(dispatch).toHaveBeenCalledWith({ type: FETCH_STORE_BRANDS, payload: [{ _id: '1' }] });
  });

  it('handles a failed fetch', async () => {
    mock.onGet(`${API_URL}/brand/list`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await fetchStoreBrands()(dispatch, () => ({}));

    expect(dispatch).not.toHaveBeenCalledWith(expect.objectContaining({ type: FETCH_STORE_BRANDS }));
  });
});

describe('fetchBrands', () => {
  it('fetches the dashboard brand list, toggling loading around it', async () => {
    mock.onGet(`${API_URL}/brand`).reply(200, { brands: [{ _id: '1' }] });
    const dispatch = vi.fn();

    await fetchBrands()(dispatch, () => ({}));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toEqual([SET_BRANDS_LOADING, FETCH_BRANDS, SET_BRANDS_LOADING]);
  });

  it('handles a failed fetch and still turns loading back off', async () => {
    mock.onGet(`${API_URL}/brand`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await fetchBrands()(dispatch, () => ({}));

    expect(dispatch.mock.calls.at(-1)[0]).toEqual({ type: SET_BRANDS_LOADING, payload: false });
  });
});

describe('fetchBrand', () => {
  it('fetches a single brand', async () => {
    mock.onGet(`${API_URL}/brand/1`).reply(200, { brand: { _id: '1' } });
    const dispatch = vi.fn();

    await fetchBrand('1')(dispatch, () => ({}));

    expect(dispatch).toHaveBeenCalledWith({ type: FETCH_BRAND, payload: { _id: '1' } });
  });

  it('handles a failed fetch', async () => {
    mock.onGet(`${API_URL}/brand/1`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await fetchBrand('1')(dispatch, () => ({}));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
  });
});

describe('fetchBrandsSelect', () => {
  it('fetches and formats brand select options with a leading empty option', async () => {
    mock.onGet(`${API_URL}/brand/list/select`).reply(200, { brands: [{ _id: '1', name: 'Nike' }] });
    const dispatch = vi.fn();

    await fetchBrandsSelect()(dispatch, () => ({}));

    expect(dispatch).toHaveBeenCalledWith({
      type: FETCH_BRANDS_SELECT,
      payload: [{ value: 0, label: 'No option selected' }, { value: '1', label: 'Nike' }]
    });
  });

  it('handles a failed fetch', async () => {
    mock.onGet(`${API_URL}/brand/list/select`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await fetchBrandsSelect()(dispatch, () => ({}));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
  });
});

describe('addBrand', () => {
  const validBrand = { name: 'Nike', description: 'Shoes' };

  it('rejects invalid form data without calling the API', async () => {
    const dispatch = vi.fn();

    await addBrand()(dispatch, () => ({ brand: { brandFormData: {} } }));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: SET_BRAND_FORM_ERRORS }));
  });

  it('creates the brand, resets the form, and navigates back', async () => {
    mock.onPost(`${API_URL}/brand/add`).reply(200, {
      success: true,
      message: 'Added!',
      brand: { _id: '1', ...validBrand }
    });
    const dispatch = vi.fn();

    await addBrand()(dispatch, () => ({ brand: { brandFormData: validBrand } }));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toEqual([
      'RNS_SHOW_NOTIFICATION',
      ADD_BRAND,
      '@@router/CALL_HISTORY_METHOD',
      RESET_BRAND
    ]);
  });

  it('does nothing extra when the server reports failure', async () => {
    mock.onPost(`${API_URL}/brand/add`).reply(200, { success: false, message: 'Nope' });
    const dispatch = vi.fn();

    await addBrand()(dispatch, () => ({ brand: { brandFormData: validBrand } }));

    expect(dispatch).not.toHaveBeenCalled();
  });

  it('handles a failed create', async () => {
    mock.onPost(`${API_URL}/brand/add`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await addBrand()(dispatch, () => ({ brand: { brandFormData: validBrand } }));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
  });
});

describe('updateBrand', () => {
  const brand = { _id: '1', name: 'Nike', slug: 'nike', description: 'Shoes' };

  it('rejects invalid form data without calling the API', async () => {
    const dispatch = vi.fn();

    await updateBrand()(dispatch, () => ({ brand: { brand: {} } }));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: SET_BRAND_FORM_EDIT_ERRORS }));
  });

  it('updates the brand and navigates back', async () => {
    mock.onPut(`${API_URL}/brand/1`).reply(200, { success: true, message: 'Updated!' });
    const dispatch = vi.fn();

    await updateBrand()(dispatch, () => ({ brand: { brand } }));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toEqual(['RNS_SHOW_NOTIFICATION', '@@router/CALL_HISTORY_METHOD']);
  });

  it('handles a failed update', async () => {
    mock.onPut(`${API_URL}/brand/1`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await updateBrand()(dispatch, () => ({ brand: { brand } }));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
  });
});

describe('activateBrand', () => {
  it('re-fetches the brand after a successful (de)activation', async () => {
    mock.onPut(`${API_URL}/brand/1/active`).reply(200, { success: true, message: 'Updated!' });
    mock.onGet(`${API_URL}/brand/1`).reply(200, { brand: { _id: '1' } });
    const dispatch = vi.fn();

    await activateBrand('1', false)(dispatch, () => ({ brand: { brand: { _id: '1' } } }));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toContain('RNS_SHOW_NOTIFICATION');
  });

  it('handles a failed request', async () => {
    mock.onPut(`${API_URL}/brand/1/active`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await activateBrand('1', false)(dispatch, () => ({ brand: { brand: { _id: '1' } } }));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
  });
});

describe('deleteBrand', () => {
  it('deletes the brand and navigates back', async () => {
    mock.onDelete(`${API_URL}/brand/delete/1`).reply(200, { success: true, message: 'Deleted!' });
    const dispatch = vi.fn();

    await deleteBrand('1')(dispatch, () => ({}));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toEqual(['RNS_SHOW_NOTIFICATION', REMOVE_BRAND, '@@router/CALL_HISTORY_METHOD']);
  });

  it('handles a failed delete', async () => {
    mock.onDelete(`${API_URL}/brand/delete/1`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await deleteBrand('1')(dispatch, () => ({}));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
  });
});
