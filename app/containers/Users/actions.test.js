import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { setUserLoading, fetchUsers, searchUsers } from './actions';
import { FETCH_USERS, FETCH_SEARCHED_USERS, SET_ADVANCED_FILTERS, SET_USERS_LOADING } from './constants';
import { API_URL } from '../../constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

it('setUserLoading carries the loading flag', () => {
  expect(setUserLoading(true)).toEqual({ type: SET_USERS_LOADING, payload: true });
});

describe('fetchUsers', () => {
  it('fetches a page of users and merges pagination info', async () => {
    mock.onGet(`${API_URL}/user`).reply(200, {
      users: [{ _id: '1' }],
      totalPages: 3,
      currentPage: 2,
      count: 25
    });
    const dispatch = vi.fn();

    await fetchUsers(2)(dispatch, () => ({}));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toEqual([SET_USERS_LOADING, FETCH_USERS, SET_ADVANCED_FILTERS, SET_USERS_LOADING]);
    expect(dispatch.mock.calls[2][0].payload).toEqual({ totalPages: 3, currentPage: 2, count: 25 });
  });

  it('defaults to page 1 when none is given', async () => {
    mock.onGet(`${API_URL}/user`).reply(config => {
      expect(config.params.page).toBe(1);
      return [200, { users: [], totalPages: 1, currentPage: 1, count: 0 }];
    });
    const dispatch = vi.fn();

    await fetchUsers()(dispatch, () => ({}));
  });

  it('handles a failed fetch', async () => {
    mock.onGet(`${API_URL}/user`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await fetchUsers(1)(dispatch, () => ({}));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).not.toContain(FETCH_USERS);
    expect(dispatch.mock.calls.at(-1)[0]).toEqual({ type: SET_USERS_LOADING, payload: false });
  });
});

describe('searchUsers', () => {
  it('searches users by the given filter value', async () => {
    mock.onGet(`${API_URL}/user/search`).reply(200, { users: [{ _id: '1' }] });
    const dispatch = vi.fn();

    await searchUsers({ value: 'jane' })(dispatch, () => ({}));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toEqual([SET_USERS_LOADING, FETCH_SEARCHED_USERS, SET_USERS_LOADING]);
  });

  it('handles a failed search', async () => {
    mock.onGet(`${API_URL}/user/search`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await searchUsers({ value: 'jane' })(dispatch, () => ({}));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).not.toContain(FETCH_SEARCHED_USERS);
  });
});
