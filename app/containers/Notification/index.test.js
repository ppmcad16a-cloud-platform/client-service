import React from 'react';
import { screen, act } from '@testing-library/react';
import { success } from 'react-notification-system-redux';

import Notification from 'app/containers/Notification';
import renderWithProviders from '../../../tests/renderWithProviders';

// react-notification-system-redux's wrapper only reacts to notifications
// added incrementally *after* mount (its underlying NotificationSystem ref
// is populated via a props-change lifecycle) — seeding the initial Redux
// state with a notification already present at mount never renders it.
it('renders a toast for a notification dispatched after mount', () => {
  const { store } = renderWithProviders(<Notification />);

  act(() => {
    store.dispatch(success({ title: 'Saved!', position: 'tr', autoDismiss: 0 }));
  });

  expect(screen.getByText('Saved!')).toBeInTheDocument();
});

it('renders no toast markup when there are no notifications', () => {
  const { container } = renderWithProviders(<Notification />);

  expect(container.querySelector('.notification')).not.toBeInTheDocument();
});
