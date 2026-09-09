import axios from 'axios';

import setToken from './token';

afterEach(() => {
  delete axios.defaults.headers.common['Authorization'];
});

it('sets the Authorization header on axios defaults when given a token', () => {
  setToken('Bearer abc123');
  expect(axios.defaults.headers.common['Authorization']).toBe('Bearer abc123');
});

it('clears the Authorization header when given a falsy token', () => {
  axios.defaults.headers.common['Authorization'] = 'Bearer abc123';

  setToken(null);

  expect(axios.defaults.headers.common['Authorization']).toBeUndefined();
});
