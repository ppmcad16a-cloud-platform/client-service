import reviewReducer from './reducer';
import {
  FETCH_REVIEWS,
  ADD_REVIEW,
  REMOVE_REVIEW,
  FETCH_PRODUCT_REVIEWS,
  REVIEW_CHANGE,
  SET_REVIEWS_LOADING,
  RESET_REVIEW,
  SET_REVIEW_FORM_ERRORS,
  SET_ADVANCED_FILTERS
} from './constants';

const initialReviewFormData = {
  title: '',
  review: '',
  rating: 0,
  isRecommended: { value: 1, label: 'Yes' }
};

const initialState = {
  reviews: [],
  isLoading: false,
  advancedFilters: { totalPages: 1, currentPage: 1, count: 0 },
  productReviews: [],
  reviewsSummary: { ratingSummary: [], totalRatings: 0, totalReviews: 0, totalSummary: 0 },
  reviewFormData: initialReviewFormData,
  reviewFormErrors: {}
};

it('returns the initial state by default', () => {
  expect(reviewReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
});

it('stores the dashboard reviews list', () => {
  const reviews = [{ _id: '1' }];
  expect(reviewReducer(initialState, { type: FETCH_REVIEWS, payload: reviews }).reviews).toBe(reviews);
});

it('merges advanced filters', () => {
  const state = reviewReducer(initialState, { type: SET_ADVANCED_FILTERS, payload: { currentPage: 2 } });
  expect(state.advancedFilters).toEqual({ ...initialState.advancedFilters, currentPage: 2 });
});

it('stores a product\'s reviews and summary together', () => {
  const reviews = [{ _id: '1' }];
  const summary = { ratingSummary: [1, 2, 3, 4, 5], totalRatings: 15, totalReviews: 5, totalSummary: 3 };
  const state = reviewReducer(initialState, {
    type: FETCH_PRODUCT_REVIEWS,
    payload: { reviews, reviewsSummary: summary }
  });
  expect(state.productReviews).toBe(reviews);
  expect(state.reviewsSummary).toBe(summary);
});

it('appends a newly-added review to productReviews', () => {
  const state = reviewReducer(
    { ...initialState, productReviews: [{ _id: '1' }] },
    { type: ADD_REVIEW, payload: { _id: '2' } }
  );
  expect(state.productReviews).toEqual([{ _id: '1' }, { _id: '2' }]);
});

it('removes a review by id from the dashboard list', () => {
  const state = reviewReducer(
    { ...initialState, reviews: [{ _id: '1' }, { _id: '2' }] },
    { type: REMOVE_REVIEW, payload: '1' }
  );
  expect(state.reviews).toEqual([{ _id: '2' }]);
});

it('merges a form change into reviewFormData', () => {
  const state = reviewReducer(initialState, { type: REVIEW_CHANGE, payload: { title: 'Great!' } });
  expect(state.reviewFormData.title).toBe('Great!');
});

it('sets the loading flag', () => {
  expect(reviewReducer(initialState, { type: SET_REVIEWS_LOADING, payload: true }).isLoading).toBe(true);
});

it('resets the review form data and errors', () => {
  const dirty = {
    ...initialState,
    reviewFormData: { title: 'x', review: 'y', rating: 5, isRecommended: { value: 0, label: 'No' } },
    reviewFormErrors: { title: ['required'] }
  };
  const state = reviewReducer(dirty, { type: RESET_REVIEW });
  expect(state.reviewFormData).toEqual(initialReviewFormData);
  expect(state.reviewFormErrors).toEqual({});
});

it('sets review form errors', () => {
  const errors = { title: ['required'] };
  expect(
    reviewReducer(initialState, { type: SET_REVIEW_FORM_ERRORS, payload: errors }).reviewFormErrors
  ).toBe(errors);
});

it('returns the existing state for an unknown action', () => {
  expect(reviewReducer(initialState, { type: 'UNKNOWN' })).toBe(initialState);
});
