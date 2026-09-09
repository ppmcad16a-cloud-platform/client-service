import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import {
  toggleMenu,
  toggleCart,
  toggleBrand,
  onSearch,
  onSuggestionsFetchRequested,
  onSuggestionsClearRequested
} from './actions';
import {
  TOGGLE_MENU,
  TOGGLE_CART,
  TOGGLE_BRAND,
  SEARCH_CHANGE,
  SUGGESTIONS_FETCH_REQUEST,
  SUGGESTIONS_CLEAR_REQUEST
} from './constants';
import { API_URL } from '../../constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

it('toggleMenu is a plain action', () => {
  expect(toggleMenu()).toEqual({ type: TOGGLE_MENU });
});

it('toggleCart is a plain action', () => {
  expect(toggleCart()).toEqual({ type: TOGGLE_CART });
});

it('toggleBrand is a plain action', () => {
  expect(toggleBrand()).toEqual({ type: TOGGLE_BRAND });
});

it('onSearch carries the raw search value', () => {
  expect(onSearch('shoes')).toEqual({ type: SEARCH_CHANGE, payload: 'shoes' });
});

it('onSuggestionsClearRequested clears to an empty array', () => {
  expect(onSuggestionsClearRequested()).toEqual({ type: SUGGESTIONS_CLEAR_REQUEST, payload: [] });
});

describe('onSuggestionsFetchRequested', () => {
  it('fetches suggestions when the trimmed value length is a multiple of 3', async () => {
    mock.onGet(`${API_URL}/product/list/search/abc`).reply(200, { products: [{ name: 'abc' }] });
    const dispatch = vi.fn();

    await onSuggestionsFetchRequested({ value: 'abc' })(dispatch, () => ({}));

    expect(dispatch).toHaveBeenCalledWith({
      type: SUGGESTIONS_FETCH_REQUEST,
      payload: [{ name: 'abc' }]
    });
  });

  it('does not fetch when the trimmed value length is not a multiple of 3', async () => {
    const dispatch = vi.fn();

    await onSuggestionsFetchRequested({ value: 'ab' })(dispatch, () => ({}));

    expect(dispatch).not.toHaveBeenCalled();
  });

  it('does not fetch for an empty value', async () => {
    const dispatch = vi.fn();

    await onSuggestionsFetchRequested({ value: '   ' })(dispatch, () => ({}));

    expect(dispatch).not.toHaveBeenCalled();
  });

  it('handles a failed fetch', async () => {
    mock.onGet(`${API_URL}/product/list/search/abc`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await onSuggestionsFetchRequested({ value: 'ABC' })(dispatch, () => ({}));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
  });
});
