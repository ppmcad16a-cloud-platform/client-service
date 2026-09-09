import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import Footer from 'app/components/Common/Footer';

it('renders both footer blocks with the same info links and the current year', () => {
  render(<Footer />, { wrapper: MemoryRouter });

  expect(screen.getByText('Customer Service')).toBeInTheDocument();
  expect(screen.getByText('Links')).toBeInTheDocument();
  expect(screen.getAllByText('Contact Us')).toHaveLength(2);
  expect(screen.getAllByText('Sell With Us')).toHaveLength(2);
  expect(screen.getAllByText('Shipping')).toHaveLength(2);
  expect(screen.getByText(`© ${new Date().getFullYear()} MERN Store`)).toBeInTheDocument();
});
