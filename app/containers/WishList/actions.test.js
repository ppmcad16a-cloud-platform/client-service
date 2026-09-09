import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { updateWishlist, fetchWishlist } from './actions';
import { FETCH_WISHLIST, SET_WISHLIST_LOADING } from './constants';
import { API_URL } from '../../constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

describe('updateWishlist', () => {
  it('shows a login prompt instead of calling the API when the user is anonymous', async () => {
    const dispatch = vi.fn();

    await updateWishlist(true, 'p1')(dispatch, () => ({ authentication: { authenticated: false } }));

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Please login to wishlist a product' })
    );
  });

  it('toggles the wishlist and hands off to fetchWishlist when authenticated', async () => {
    mock.onPost(`${API_URL}/wishlist`).reply(200, { success: true, message: 'Updated!' });
    const dispatch = vi.fn();

    await updateWishlist(true, 'p1')(dispatch, () => ({ authentication: { authenticated: true } }));

    const calls = dispatch.mock.calls.map(call => call[0]);
    expect(calls[0]).toEqual(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
    // dispatch(fetchWishlist()) hands the mock dispatch a thunk function —
    // its own behavior is already covered by fetchWishlist's own tests below.
    expect(typeof calls[1]).toBe('function');
  });

  it('does not re-fetch when the server reports failure', async () => {
    mock.onPost(`${API_URL}/wishlist`).reply(200, { success: false, message: 'Nope' });
    const dispatch = vi.fn();

    await updateWishlist(true, 'p1')(dispatch, () => ({ authentication: { authenticated: true } }));

    expect(dispatch).not.toHaveBeenCalled();
  });

  it('handles a failed request', async () => {
    mock.onPost(`${API_URL}/wishlist`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await updateWishlist(true, 'p1')(dispatch, () => ({ authentication: { authenticated: true } }));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
  });
});

describe('fetchWishlist', () => {
  it('fetches the wishlist, toggling loading around it', async () => {
    mock.onGet(`${API_URL}/wishlist`).reply(200, { wishlist: [{ _id: '1' }] });
    const dispatch = vi.fn();

    await fetchWishlist()(dispatch, () => ({}));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toEqual([SET_WISHLIST_LOADING, FETCH_WISHLIST, SET_WISHLIST_LOADING]);
  });

  it('handles a failed fetch', async () => {
    mock.onGet(`${API_URL}/wishlist`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await fetchWishlist()(dispatch, () => ({}));

    expect(dispatch.mock.calls.at(-1)[0]).toEqual({ type: SET_WISHLIST_LOADING, payload: false });
  });
});
