import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// vi.mock is hoisted above imports, so any shared state it references must
// be declared via vi.hoisted() — a plain top-level const would be in the
// temporal dead zone by the time the (hoisted) factory below runs.
const { mockSocketInstance } = vi.hoisted(() => ({
  mockSocketInstance: {
    connect: vi.fn(),
    close: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
    auth: {}
  }
}));

vi.mock('socket.io-client', () => ({
  default: vi.fn(() => mockSocketInstance)
}));

import io from 'socket.io-client';
import SocketProvider from './provider';
import SocketContext from './context';

const Consumer = () => {
  const { socket, connect, disconnect } = React.useContext(SocketContext);
  return (
    <div>
      <span data-testid='socket-state'>{socket ? 'connected' : 'disconnected'}</span>
      <button onClick={connect}>connect</button>
      <button onClick={disconnect}>disconnect</button>
    </div>
  );
};

afterEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  mockSocketInstance.auth = {};
});

it('constructs the socket (disconnected) but never connects when there is no token', () => {
  render(
    <SocketProvider>
      <Consumer />
    </SocketProvider>
  );

  fireEvent.click(screen.getByText('connect'));

  expect(io).toHaveBeenCalled();
  expect(mockSocketInstance.connect).not.toHaveBeenCalled();
  expect(screen.getByTestId('socket-state')).toHaveTextContent('disconnected');
});

it('connects with the stored token and exposes the socket once one exists', () => {
  localStorage.setItem('token', 'abc123');

  render(
    <SocketProvider>
      <Consumer />
    </SocketProvider>
  );

  fireEvent.click(screen.getByText('connect'));

  expect(mockSocketInstance.auth).toEqual({ token: 'abc123' });
  expect(mockSocketInstance.connect).toHaveBeenCalledTimes(1);
  expect(screen.getByTestId('socket-state')).toHaveTextContent('connected');
});

it('closes the socket on disconnect once one exists', () => {
  localStorage.setItem('token', 'abc123');

  render(
    <SocketProvider>
      <Consumer />
    </SocketProvider>
  );

  fireEvent.click(screen.getByText('connect'));
  fireEvent.click(screen.getByText('disconnect'));

  expect(mockSocketInstance.close).toHaveBeenCalledTimes(1);
});

it('disconnect is a no-op when there is no socket yet', () => {
  render(
    <SocketProvider>
      <Consumer />
    </SocketProvider>
  );

  fireEvent.click(screen.getByText('disconnect'));

  expect(mockSocketInstance.close).not.toHaveBeenCalled();
});
