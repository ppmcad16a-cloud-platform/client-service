import React from 'react';
import { render, screen } from '@testing-library/react';

import DisabledMerchantAccount from 'app/components/Manager/DisabledAccount/Merchant';

it("greets the user by first name and shows the disabled-account message", () => {
  render(<DisabledMerchantAccount user={{ firstName: 'Jane' }} />);

  expect(screen.getByText('Hi, Jane')).toBeInTheDocument();
  expect(screen.getByText('Unfortunately it seems your account has been disabled.')).toBeInTheDocument();
  expect(screen.getByText('Call us 951-999-9999')).toBeInTheDocument();
});
