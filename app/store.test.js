import store, { history } from './store';

afterEach(() => {
  delete window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
});

it('uses the Redux DevTools compose function when the extension is present', async () => {
  const devtoolsCompose = vi.fn(() => compose => compose);
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ = devtoolsCompose;

  vi.resetModules();
  await import('./store');

  expect(devtoolsCompose).toHaveBeenCalledWith({});
});

it('creates a real Redux store wired to the combined reducer', () => {
  expect(typeof store.dispatch).toBe('function');
  expect(typeof store.getState).toBe('function');
  expect(store.getState()).toHaveProperty('cart');
  expect(store.getState()).toHaveProperty('authentication');
});

it('dispatches actions through the thunk middleware', () => {
  const thunk = vi.fn();
  store.dispatch(thunk);

  expect(thunk).toHaveBeenCalledTimes(1);
  const [dispatchArg, getStateArg] = thunk.mock.calls[0];
  expect(typeof dispatchArg).toBe('function');
  expect(typeof getStateArg).toBe('function');
});

it('exports the router history used for connected-react-router, kept in sync with dispatched router actions', () => {
  expect(typeof history.push).toBe('function');

  history.push('/somewhere');
  expect(history.location.pathname).toBe('/somewhere');
});
