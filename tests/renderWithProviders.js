import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createMemoryHistory } from 'history';

import createReducer from '../app/reducers';

// Wraps RTL's render with the same Provider/Router shape every connected
// component expects, so container/component tests don't hand-roll this
// boilerplate. Uses the app's *real* combined reducers (app/reducers.js) —
// `preloadedState` only needs to specify the slice(s) a given test actually
// cares about; combineReducers fills in every other slice's own initial
// state as usual.
const renderWithProviders = (
  ui,
  {
    preloadedState,
    route = '/',
    history = createMemoryHistory({ initialEntries: [route] }),
    store = createStore(createReducer(history), preloadedState, applyMiddleware(thunk)),
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    </Provider>
  );

  return { store, history, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

export default renderWithProviders;
