import React from 'react';
import { render, screen } from '@testing-library/react';

import Page404 from 'app/components/Common/Page404';

it('renders the not-found message', () => {
  render(<Page404 />);

  expect(screen.getByText('The page you are looking for was not found.')).toBeInTheDocument();
});
