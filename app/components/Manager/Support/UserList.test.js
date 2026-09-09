import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import UserList from 'app/components/Manager/Support/UserList';

it('renders nothing when users is falsy', () => {
  const { container } = render(<UserList users={null} selectedUser={null} selectUser={() => {}} />);

  expect(container).toBeEmptyDOMElement();
});

it('marks the currently selected contact and shows online/offline indicators', () => {
  const users = [
    { id: 'u1', name: 'Jane', online: true },
    { id: 'u2', name: 'Bob', online: false }
  ];

  render(<UserList users={users} selectedUser={{ id: 'u1' }} selectUser={() => {}} />);

  expect(screen.getByText('Jane').closest('li')).toHaveClass('selected');
  expect(screen.getByText('Bob').closest('li')).toHaveClass('not-selected');
  expect(document.querySelector('.circle.online')).toBeInTheDocument();
  expect(document.querySelector('.circle.offline')).toBeInTheDocument();
});

it('calls selectUser with the clicked contact', () => {
  const handleSelect = vi.fn();
  const users = [{ id: 'u1', name: 'Jane', online: true }];

  render(<UserList users={users} selectedUser={null} selectUser={handleSelect} />);

  fireEvent.click(screen.getByText('Jane'));
  expect(handleSelect).toHaveBeenCalledWith(users[0]);
});
