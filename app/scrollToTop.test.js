import React from 'react';
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { act } from 'react-dom/test-utils';

import ScrollToTop from './scrollToTop';

it('scrolls to top when the route pathname changes', () => {
  const history = createMemoryHistory({ initialEntries: ['/foo'] });
  window.scroll = vi.fn();

  render(
    <Router history={history}>
      <ScrollToTop>
        <div>content</div>
      </ScrollToTop>
    </Router>
  );

  expect(window.scroll).not.toHaveBeenCalled();

  act(() => {
    history.push('/bar');
  });

  expect(window.scroll).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
});

it('does not scroll when the same pathname re-renders (e.g. only the search/query string changes)', () => {
  const history = createMemoryHistory({ initialEntries: ['/foo'] });
  window.scroll = vi.fn();

  render(
    <Router history={history}>
      <ScrollToTop>
        <div>content</div>
      </ScrollToTop>
    </Router>
  );

  act(() => {
    history.push('/foo?query=1');
  });

  expect(window.scroll).not.toHaveBeenCalled();
});

it('renders its children', () => {
  const history = createMemoryHistory({ initialEntries: ['/foo'] });

  const { getByText } = render(
    <Router history={history}>
      <ScrollToTop>
        <div>child content</div>
      </ScrollToTop>
    </Router>
  );

  expect(getByText('child content')).toBeInTheDocument();
});
