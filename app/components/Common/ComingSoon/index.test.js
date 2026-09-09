import React from 'react';
import { render, screen } from '@testing-library/react';

import ComingSoon from 'app/components/Common/ComingSoon';

it('renders the heading and any children passed in', () => {
  render(
    <ComingSoon>
      <p>Check back later</p>
    </ComingSoon>
  );

  expect(screen.getByText('Coming soon')).toBeInTheDocument();
  expect(screen.getByText('Check back later')).toBeInTheDocument();
});
