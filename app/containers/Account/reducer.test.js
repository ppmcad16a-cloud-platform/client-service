import accountReducer from './reducer';
import {
  ACCOUNT_CHANGE,
  FETCH_PROFILE,
  CLEAR_ACCOUNT,
  SET_PROFILE_LOADING
} from './constants';

const initialState = {
  user: { firstName: '', lastName: '', provider: '', role: '' },
  isLoading: false
};

it('returns the initial state by default', () => {
  expect(accountReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
});

it('merges a form change into user', () => {
  const state = accountReducer(initialState, {
    type: ACCOUNT_CHANGE,
    payload: { firstName: 'Jane' }
  });
  expect(state.user).toEqual({ ...initialState.user, firstName: 'Jane' });
});

it('merges a fetched profile into user', () => {
  const state = accountReducer(initialState, {
    type: FETCH_PROFILE,
    payload: { firstName: 'Jane', role: 'ROLE MEMBER' }
  });
  expect(state.user.firstName).toBe('Jane');
  expect(state.user.role).toBe('ROLE MEMBER');
});

it('clears the account down to just firstName/lastName on sign-out', () => {
  const loggedIn = {
    ...initialState,
    user: { firstName: 'Jane', lastName: 'Doe', provider: 'Email', role: 'ROLE MEMBER' }
  };
  const state = accountReducer(loggedIn, { type: CLEAR_ACCOUNT });
  // Existing gap: provider/role aren't reset back to '', so they end up
  // undefined rather than matching the initialState shape.
  expect(state.user).toEqual({ firstName: '', lastName: '' });
  expect(state.user.role).toBeUndefined();
});

it('sets the loading flag', () => {
  const state = accountReducer(initialState, {
    type: SET_PROFILE_LOADING,
    payload: true
  });
  expect(state.isLoading).toBe(true);
});

it('returns the existing state for an unknown action', () => {
  expect(accountReducer(initialState, { type: 'UNKNOWN' })).toBe(initialState);
});
