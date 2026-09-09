import React from 'react';
import { render } from '@testing-library/react';

import LoadingIndicator from 'app/components/Common/LoadingIndicator';

it('renders as a fixed-position overlay by default', () => {
  const { container } = render(<LoadingIndicator />);

  const outer = container.firstChild;
  expect(outer).toHaveClass('position-fixed', 'overlay');
  expect(outer).not.toHaveClass('backdrop');
});

it('renders inline (relative position) when inline is set', () => {
  const { container } = render(<LoadingIndicator inline />);

  expect(container.firstChild).toHaveClass('position-relative');
});

it('adds a backdrop class when backdrop is set', () => {
  const { container } = render(<LoadingIndicator backdrop />);

  expect(container.firstChild).toHaveClass('backdrop');
});
