import React from 'react';

import Homepage from 'app/containers/Homepage';
import renderWithProviders from '../../../tests/renderWithProviders';

it('renders the hero carousel and side banners', () => {
  const { container } = renderWithProviders(<Homepage />);

  expect(container.querySelector('.home-carousel')).toBeInTheDocument();
  expect(container.querySelectorAll('img').length).toBeGreaterThan(0);
});
