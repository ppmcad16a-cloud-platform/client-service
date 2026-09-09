/**
 *
 * store.js
 * store configuration
 */

import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';

import createReducer from './reducers';

// Real browser (non-hash) history — this is why any static host serving the
// production build must fall back to index.html for unknown paths, or
// refreshing on a client-side route like /shop 404s. See client/README.md.
export const history = createBrowserHistory({
  basename: '/',
  hashType: 'noslash'
});

const middlewares = [thunk, routerMiddleware(history)];

const enhancers = [applyMiddleware(...middlewares)];

// If Redux DevTools Extension is installed use it, otherwise use Redux compose
const composeEnhancers =
  process.env.NODE_ENV !== 'production' &&
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

const store = createStore(
  createReducer(history),
  composeEnhancers(...enhancers)
);

/* v8 ignore start -- Webpack-only HMR hook; under the Vite-based test build `module` has no `hot` property at all (only `exports`), so this is unreachable there even though it's live in the real webpack dev build */
if (module.hot) {
  // Enable Webpack hot module replacement for reducers: when reducers.js
  // changes during development, swap in the new combined reducer without a
  // full page reload (existing state is preserved).
  module.hot.accept('./reducers', () => {
    const nextRootReducer = require('./reducers').default; // eslint-disable-line global-require
    store.replaceReducer(nextRootReducer(history));
  });
}
/* v8 ignore stop */

export default store;
