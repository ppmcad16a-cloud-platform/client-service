import React from 'react';
import { render, screen } from '@testing-library/react';

import DropdownConfirm from 'app/components/Common/DropdownConfirm';

it('renders the label and children content', () => {
  render(
    <DropdownConfirm label='Delete' className='extra'>
      <span>Are you sure?</span>
    </DropdownConfirm>
  );

  expect(screen.getByText('Delete')).toBeInTheDocument();
  expect(screen.getByText('Are you sure?')).toBeInTheDocument();
});
