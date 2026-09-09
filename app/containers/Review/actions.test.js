import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import {
  reviewChange,
  fetchReviews,
  approveReview,
  rejectReview,
  deleteReview,
  fetchProductReviews,
  addProductReview,
  getProductReviewsSummary
} from './actions';
import {
  FETCH_REVIEWS,
  SET_REVIEWS_LOADING,
  REMOVE_REVIEW,
  FETCH_PRODUCT_REVIEWS,
  REVIEW_CHANGE,
  RESET_REVIEW,
  SET_REVIEW_FORM_ERRORS,
  SET_ADVANCED_FILTERS
} from './constants';
import { API_URL } from '../../constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

it('reviewChange builds a keyed payload', () => {
  expect(reviewChange('title', 'Great!')).toEqual({ type: REVIEW_CHANGE, payload: { title: 'Great!' } });
});

describe('fetchReviews', () => {
  it('fetches a page of reviews and merges pagination info', async () => {
    mock.onGet(`${API_URL}/review`).reply(200, {
      reviews: [{ _id: '1' }],
      totalPages: 2,
      currentPage: 1,
      count: 15
    });
    const dispatch = vi.fn();

    await fetchReviews('n', 1)(dispatch, () => ({}));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toEqual([SET_REVIEWS_LOADING, FETCH_REVIEWS, SET_ADVANCED_FILTERS, SET_REVIEWS_LOADING]);
  });

  it('handles a failed fetch', async () => {
    mock.onGet(`${API_URL}/review`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await fetchReviews()(dispatch, () => ({}));

    expect(dispatch.mock.calls.at(-1)[0]).toEqual({ type: SET_REVIEWS_LOADING, payload: false });
  });
});

describe('approveReview', () => {
  it('approves and hands off to fetchReviews', async () => {
    mock.onPut(`${API_URL}/review/approve/1`).reply(200, {});
    const dispatch = vi.fn();

    await approveReview({ _id: '1' })(dispatch, () => ({}));

    // dispatch(fetchReviews()) hands the mock dispatch a thunk function —
    // fetchReviews' own behavior is already covered by its own tests above.
    expect(typeof dispatch.mock.calls[0][0]).toBe('function');
  });

  it('handles a failed request', async () => {
    mock.onPut(`${API_URL}/review/approve/1`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await approveReview({ _id: '1' })(dispatch, () => ({}));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
  });
});

describe('rejectReview', () => {
  it('rejects and hands off to fetchReviews', async () => {
    mock.onPut(`${API_URL}/review/reject/1`).reply(200, {});
    const dispatch = vi.fn();

    await rejectReview({ _id: '1' })(dispatch, () => ({}));

    expect(typeof dispatch.mock.calls[0][0]).toBe('function');
  });

  it('handles a failed request', async () => {
    mock.onPut(`${API_URL}/review/reject/1`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await rejectReview({ _id: '1' })(dispatch, () => ({}));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
  });
});

describe('deleteReview', () => {
  it('deletes the review', async () => {
    mock.onDelete(`${API_URL}/review/delete/1`).reply(200, { success: true, message: 'Deleted!' });
    const dispatch = vi.fn();

    await deleteReview('1')(dispatch, () => ({}));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toEqual(['RNS_SHOW_NOTIFICATION', REMOVE_REVIEW]);
  });

  it('handles a failed delete', async () => {
    mock.onDelete(`${API_URL}/review/delete/1`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await deleteReview('1')(dispatch, () => ({}));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
  });
});

describe('fetchProductReviews', () => {
  it('fetches a product\'s reviews with a computed summary', async () => {
    mock.onGet(`${API_URL}/review/widget`).reply(200, {
      reviews: [{ rating: 5 }, { rating: 5 }]
    });
    const dispatch = vi.fn();

    await fetchProductReviews('widget')(dispatch, () => ({}));

    expect(dispatch).toHaveBeenCalledWith({
      type: FETCH_PRODUCT_REVIEWS,
      payload: {
        reviews: [{ rating: 5 }, { rating: 5 }],
        reviewsSummary: {
          ratingSummary: [{ 5: 2 }, { 4: 0 }, { 3: 0 }, { 2: 0 }, { 1: 0 }],
          totalRatings: 10,
          totalReviews: 2,
          totalSummary: 2
        }
      }
    });
  });

  it('handles a failed fetch', async () => {
    mock.onGet(`${API_URL}/review/widget`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await fetchProductReviews('widget')(dispatch, () => ({}));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
  });
});

describe('addProductReview', () => {
  const getState = () => ({
    review: {
      reviewFormData: {
        title: 'Great!',
        review: 'Loved it',
        rating: 5,
        isRecommended: { value: 1, label: 'Yes' }
      }
    },
    product: { storeProduct: { _id: 'p1', slug: 'widget' } }
  });

  it('rejects invalid form data without calling the API', async () => {
    const dispatch = vi.fn();

    // isRecommended must at least be present (as an object with a `.value`)
    // for `review.isRecommended.value` to not throw before validation ever
    // runs — every other field is left empty to fail the `required` rules.
    await addProductReview()(dispatch, () => ({
      review: { reviewFormData: { isRecommended: { value: 0, label: 'No' } } },
      product: { storeProduct: {} }
    }));

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: SET_REVIEW_FORM_ERRORS }));
  });

  it('submits the review, re-fetches the product reviews, and resets the form', async () => {
    mock.onPost(`${API_URL}/review/add`).reply(200, { success: true, message: 'Submitted!' });
    mock.onGet(`${API_URL}/review/widget`).reply(200, { reviews: [] });
    const dispatch = vi.fn();

    await addProductReview()(dispatch, getState);

    // dispatch(fetchProductReviews(...)) hands the mock dispatch a thunk
    // function — its own behavior is already covered by fetchProductReviews'
    // own tests above.
    const calls = dispatch.mock.calls.map(call => call[0]);
    expect(calls[0]).toEqual(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
    expect(typeof calls[1]).toBe('function');
    expect(calls[2]).toEqual({ type: RESET_REVIEW });
  });

  it('handles a failed submission', async () => {
    mock.onPost(`${API_URL}/review/add`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await addProductReview()(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION' }));
  });
});

describe('getProductReviewsSummary', () => {
  it('returns zeroed-out summary for an empty review list', () => {
    expect(getProductReviewsSummary([])).toEqual({
      ratingSummary: [{ 5: 0 }, { 4: 0 }, { 3: 0 }, { 2: 0 }, { 1: 0 }],
      totalRatings: 0,
      totalReviews: 0,
      totalSummary: 0
    });
  });

  it('buckets every rating from 1 to 5 (rounding to the nearest star)', () => {
    const reviews = [
      { rating: 5 },
      { rating: 4.4 }, // rounds to 4
      { rating: 3 },
      { rating: 2 },
      { rating: 1 }
    ];

    const result = getProductReviewsSummary(reviews);

    expect(result.ratingSummary).toEqual([{ 5: 1 }, { 4: 1 }, { 3: 1 }, { 2: 1 }, { 1: 1 }]);
    expect(result.totalReviews).toBe(5);
    expect(result.totalSummary).toBe(5);
  });

  it('does not bucket a 0/falsy rating anywhere (default case is a no-op)', () => {
    const result = getProductReviewsSummary([{ rating: 0 }]);

    expect(result.ratingSummary).toEqual([{ 5: 0 }, { 4: 0 }, { 3: 0 }, { 2: 0 }, { 1: 0 }]);
    expect(result.totalReviews).toBe(1);
    expect(result.totalSummary).toBe(0);
  });
});
