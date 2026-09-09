import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import SubPage from 'app/components/Manager/SubPage';

it('renders the title and children, with no action button by default', () => {
  render(
    <SubPage title='Products'>
      <p>Body content</p>
    </SubPage>
  );

  expect(screen.getByText('Products')).toBeInTheDocument();
  expect(screen.getByText('Body content')).toBeInTheDocument();
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});

it('renders and wires up the action button when actionTitle is given', () => {
  const handleAction = vi.fn();
  render(<SubPage title='Products' actionTitle='Add Product' handleAction={handleAction} />);

  fireEvent.click(screen.getByRole('button', { name: 'Add Product' }));
  expect(handleAction).toHaveBeenCalledTimes(1);
});
