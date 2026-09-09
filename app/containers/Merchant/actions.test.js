import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import {
  merchantChange,
  merchantSignupChange,
  setMerchantLoading,
  setMerchantSubmitting,
  addMerchant,
  fetchMerchants,
  searchMerchants,
  disableMerchant,
  approveMerchant,
  rejectMerchant,
  merchantSignUp,
  deleteMerchant
} from './actions';
import {
  FETCH_MERCHANTS,
  SET_ADVANCED_FILTERS,
  FETCH_SEARCHED_MERCHANTS,
  MERCHANT_CHANGE,
  SET_MERCHANT_FORM_ERRORS,
  SET_MERCHANTS_LOADING,
  SET_MERCHANTS_SUBMITTING,
  RESET_MERCHANT,
  SIGNUP_CHANGE,
  SET_SIGNUP_FORM_ERRORS,
  SIGNUP_RESET
} from './constants';
import { API_URL } from '../../constants';

const mock = new MockAdapter(axios);
const GRAPHQL_URL = `${API_URL}/graphql`;

afterEach(() => {
  mock.reset();
});

it('merchantChange builds a keyed payload', () => {
  expect(merchantChange('name', 'Acme')).toEqual({ type: MERCHANT_CHANGE, payload: { name: 'Acme' } });
});

it('merchantSignupChange builds a keyed payload', () => {
  expect(merchantSignupChange('firstName', 'Jane')).toEqual({
    type: SIGNUP_CHANGE,
    payload: { firstName: 'Jane' }
  });
});

it('setMerchantLoading carries the loading flag', () => {
  expect(setMerchantLoading(true)).toEqual({ type: SET_MERCHANTS_LOADING, payload: true });
});

it('setMerchantSubmitting carries the submitting flag', () => {
  expect(setMerchantSubmitting(true)).toEqual({ type: SET_MERCHANTS_SUBMITTING, payload: true });
});

describe('addMerchant', () => {
  const validForm = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    phoneNumber: '1234567890',
    brandName: 'Acme',
    business: 'A long enough business description'
  };

  it('rejects invalid form data without calling the API', async () => {
    const dispatch = vi.fn();

    await addMerchant()(dispatch, () => ({ merchant: { merchantFormData: {} } }));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: SET_MERCHANT_FORM_ERRORS }));
  });

  it('submits, resets the form, and stays on the page by default', async () => {
    mock.onPost(GRAPHQL_URL).reply(200, { data: { addMerchant: { success: true, message: 'Added!' } } });
    const dispatch = vi.fn();

    await addMerchant()(dispatch, () => ({ merchant: { merchantFormData: validForm } }));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toEqual([
      SET_MERCHANTS_LOADING,
      SET_MERCHANTS_SUBMITTING,
      'RNS_SHOW_NOTIFICATION',
      RESET_MERCHANT,
      SET_MERCHANTS_SUBMITTING,
      SET_MERCHANTS_LOADING
    ]);
  });

  it('navigates back when isBack is true', async () => {
    mock.onPost(GRAPHQL_URL).reply(200, { data: { addMerchant: { success: true, message: 'Added!' } } });
    const dispatch = vi.fn();

    await addMerchant(true)(dispatch, () => ({ merchant: { merchantFormData: validForm } }));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toContain('@@router/CALL_HISTORY_METHOD');
  });

  it('does not show a success toast or reset the form when the server reports failure', async () => {
    mock.onPost(GRAPHQL_URL).reply(200, { data: { addMerchant: { success: false, message: 'Nope' } } });
    const dispatch = vi.fn();

    await addMerchant()(dispatch, () => ({ merchant: { merchantFormData: validForm } }));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toEqual([SET_MERCHANTS_LOADING, SET_MERCHANTS_SUBMITTING, SET_MERCHANTS_SUBMITTING, SET_MERCHANTS_LOADING]);
  });

  it('handles a failed request', async () => {
    mock.onPost(GRAPHQL_URL).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await addMerchant()(dispatch, () => ({ merchant: { merchantFormData: validForm } }));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
  });
});

describe('fetchMerchants', () => {
  it('fetches a page of merchants and merges pagination info', async () => {
    mock.onPost(GRAPHQL_URL).reply(200, {
      data: { merchants: { merchants: [{ _id: '1' }], totalPages: 2, currentPage: 1, count: 15 } }
    });
    const dispatch = vi.fn();

    await fetchMerchants('merchant', 1)(dispatch, () => ({}));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toEqual([SET_MERCHANTS_LOADING, FETCH_MERCHANTS, SET_ADVANCED_FILTERS, SET_MERCHANTS_LOADING]);
  });

  it('handles a failed fetch', async () => {
    mock.onPost(GRAPHQL_URL).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await fetchMerchants()(dispatch, () => ({}));

    expect(dispatch.mock.calls.at(-1)[0]).toEqual({ type: SET_MERCHANTS_LOADING, payload: false });
  });
});

describe('searchMerchants', () => {
  it('searches merchants by the given filter value', async () => {
    mock.onPost(GRAPHQL_URL).reply(200, { data: { merchantSearch: { merchants: [{ _id: '1' }] } } });
    const dispatch = vi.fn();

    await searchMerchants({ value: 'acme' })(dispatch, () => ({}));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toEqual([SET_MERCHANTS_LOADING, FETCH_SEARCHED_MERCHANTS, SET_MERCHANTS_LOADING]);
  });

  it('handles a failed search', async () => {
    mock.onPost(GRAPHQL_URL).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await searchMerchants({ value: 'acme' })(dispatch, () => ({}));

    expect(dispatch.mock.calls.at(-1)[0]).toEqual({ type: SET_MERCHANTS_LOADING, payload: false });
  });
});

describe('disableMerchant', () => {
  it('re-runs the search list when a search value is present', async () => {
    // Two sequential POST /graphql calls: setMerchantActive, then the
    // follow-up merchantSearch — replyOnce chains resolve them in order.
    mock
      .onPost(GRAPHQL_URL)
      .replyOnce(200, { data: { setMerchantActive: { success: true } } })
      .onPost(GRAPHQL_URL)
      .replyOnce(200, { data: { merchantSearch: { merchants: [] } } });
    const dispatch = vi.fn();

    await disableMerchant({ _id: '1' }, false, 'acme', 1)(dispatch, () => ({}));

    expect(typeof dispatch.mock.calls[0][0]).toBe('function');
  });

  it('re-fetches the plain list when there is no search value', async () => {
    mock
      .onPost(GRAPHQL_URL)
      .replyOnce(200, { data: { setMerchantActive: { success: true } } })
      .onPost(GRAPHQL_URL)
      .replyOnce(200, { data: { merchants: { merchants: [] } } });
    const dispatch = vi.fn();

    await disableMerchant({ _id: '1' }, false, undefined, 1)(dispatch, () => ({}));

    expect(typeof dispatch.mock.calls[0][0]).toBe('function');
  });

  it('handles a failed request', async () => {
    mock.onPost(GRAPHQL_URL).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await disableMerchant({ _id: '1' }, false, undefined, 1)(dispatch, () => ({}));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
  });
});

describe('approveMerchant', () => {
  it('re-runs the search list when a search value is present', async () => {
    mock
      .onPost(GRAPHQL_URL)
      .replyOnce(200, { data: { approveMerchant: { success: true } } })
      .onPost(GRAPHQL_URL)
      .replyOnce(200, { data: { merchantSearch: { merchants: [] } } });
    const dispatch = vi.fn();

    await approveMerchant({ _id: '1' }, 'acme', 1)(dispatch, () => ({}));

    expect(typeof dispatch.mock.calls[0][0]).toBe('function');
  });

  it('re-fetches the plain list when there is no search value', async () => {
    mock
      .onPost(GRAPHQL_URL)
      .replyOnce(200, { data: { approveMerchant: { success: true } } })
      .onPost(GRAPHQL_URL)
      .replyOnce(200, { data: { merchants: { merchants: [] } } });
    const dispatch = vi.fn();

    await approveMerchant({ _id: '1' }, undefined, 1)(dispatch, () => ({}));

    expect(typeof dispatch.mock.calls[0][0]).toBe('function');
  });

  it('handles a failed request', async () => {
    mock.onPost(GRAPHQL_URL).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await approveMerchant({ _id: '1' }, undefined, 1)(dispatch, () => ({}));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
  });
});

describe('rejectMerchant', () => {
  it('re-runs the search list when a search value is present', async () => {
    mock
      .onPost(GRAPHQL_URL)
      .replyOnce(200, { data: { rejectMerchant: { success: true } } })
      .onPost(GRAPHQL_URL)
      .replyOnce(200, { data: { merchantSearch: { merchants: [] } } });
    const dispatch = vi.fn();

    await rejectMerchant({ _id: '1' }, 'acme', 1)(dispatch, () => ({}));

    expect(typeof dispatch.mock.calls[0][0]).toBe('function');
  });

  it('re-fetches the plain list when there is no search value', async () => {
    mock
      .onPost(GRAPHQL_URL)
      .replyOnce(200, { data: { rejectMerchant: { success: true } } })
      .onPost(GRAPHQL_URL)
      .replyOnce(200, { data: { merchants: { merchants: [] } } });
    const dispatch = vi.fn();

    await rejectMerchant({ _id: '1' }, undefined, 1)(dispatch, () => ({}));

    expect(typeof dispatch.mock.calls[0][0]).toBe('function');
  });

  it('handles a failed request', async () => {
    mock.onPost(GRAPHQL_URL).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await rejectMerchant({ _id: '1' }, undefined, 1)(dispatch, () => ({}));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
  });
});

describe('merchantSignUp', () => {
  const validForm = {
    email: 'jane@example.com',
    password: 'secret1',
    firstName: 'Jane',
    lastName: 'Doe'
  };

  it('rejects invalid form data without calling the API', async () => {
    const dispatch = vi.fn();

    await merchantSignUp('tok')(dispatch, () => ({ merchant: { signupFormData: {} } }));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: SET_SIGNUP_FORM_ERRORS }));
  });

  it('signs up, signs the user out, and redirects to login', async () => {
    mock.onPost(GRAPHQL_URL).reply(200, { data: { merchantSignup: { success: true } } });
    const dispatch = vi.fn();

    await merchantSignUp('tok')(dispatch, () => ({ merchant: { signupFormData: validForm } }));

    const calls = dispatch.mock.calls.map(call => call[0]);
    // dispatch(signOut()) hands the mock dispatch a thunk function — signOut's
    // own behavior is already covered by Login's own actions tests.
    expect(typeof calls[0]).toBe('function');
    expect(calls[1]).toEqual(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
    expect(calls[2].type).toBe('@@router/CALL_HISTORY_METHOD');
    expect(calls[3]).toEqual({ type: SIGNUP_RESET });
  });

  it('handles a failed request with a custom error title', async () => {
    mock.onPost(GRAPHQL_URL).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await merchantSignUp('tok')(dispatch, () => ({ merchant: { signupFormData: validForm } }));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
  });
});

describe('deleteMerchant', () => {
  it('re-runs the search list when a search value is present', async () => {
    mock
      .onPost(GRAPHQL_URL)
      .replyOnce(200, { data: { deleteMerchant: { success: true, message: 'Deleted!' } } })
      .onPost(GRAPHQL_URL)
      .replyOnce(200, { data: { merchantSearch: { merchants: [] } } });
    const dispatch = vi.fn();

    await deleteMerchant({ _id: '1' }, 'acme', 1)(dispatch, () => ({}));

    const calls = dispatch.mock.calls.map(call => call[0]);
    expect(calls[0]).toEqual(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
    expect(typeof calls[1]).toBe('function');
  });

  it('re-fetches the plain list when there is no search value', async () => {
    mock
      .onPost(GRAPHQL_URL)
      .replyOnce(200, { data: { deleteMerchant: { success: true, message: 'Deleted!' } } })
      .onPost(GRAPHQL_URL)
      .replyOnce(200, { data: { merchants: { merchants: [] } } });
    const dispatch = vi.fn();

    await deleteMerchant({ _id: '1' }, undefined, 1)(dispatch, () => ({}));

    const calls = dispatch.mock.calls.map(call => call[0]);
    expect(calls[0]).toEqual(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
    expect(typeof calls[1]).toBe('function');
  });

  it('does nothing further when the server reports failure', async () => {
    mock.onPost(GRAPHQL_URL).reply(200, { data: { deleteMerchant: { success: false, message: 'Nope' } } });
    const dispatch = vi.fn();

    await deleteMerchant({ _id: '1' }, undefined, 1)(dispatch, () => ({}));

    expect(dispatch).not.toHaveBeenCalled();
  });

  it('handles a failed delete', async () => {
    mock.onPost(GRAPHQL_URL).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await deleteMerchant({ _id: '1' }, undefined, 1)(dispatch, () => ({}));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
  });
});
