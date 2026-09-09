import React from 'react';
import { screen } from '@testing-library/react';

import Support from 'app/containers/Support';
import renderWithProviders from '../../../tests/renderWithProviders';

const { socketState } = vi.hoisted(() => ({
  socketState: { current: { socket: null, connect: vi.fn(), disconnect: vi.fn() } }
}));

vi.mock('app/contexts/Socket', () => ({
  useSocket: () => socketState.current
}));

it("renders the page heading and the real Support chat manager, wired to the account's user", () => {
  renderWithProviders(<Support />, {
    preloadedState: { account: { user: { _id: 'me', firstName: 'Jane' } } }
  });

  expect(screen.getByText('Support')).toBeInTheDocument();
  // SupportManager renders "Not connected." when useSocket() returns no socket.
  expect(screen.getByText('Not connected.')).toBeInTheDocument();
});
