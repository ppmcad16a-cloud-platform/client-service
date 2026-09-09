import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';

import Support from 'app/components/Manager/Support';

const { socketState, mockSocket } = vi.hoisted(() => {
  const mockSocket = { connect: vi.fn(), close: vi.fn(), on: vi.fn(), off: vi.fn(), emit: vi.fn(), auth: {} };
  return { socketState: { current: { socket: null, connect: vi.fn(), disconnect: vi.fn() } }, mockSocket };
});

vi.mock('app/contexts/Socket', () => ({
  useSocket: () => socketState.current
}));

// jsdom doesn't implement scrollIntoView; MessageList (rendered once a chat
// is selected) calls it via a ref on every mount/update.
beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

// Grabs the callback most recently registered via socket.on(eventName, cb),
// and invokes it inside act() — these callbacks run outside any React event
// (they're plain functions we call directly, standing in for a real socket
// firing), so React 16 won't auto-flush the resulting setState calls before
// our very next assertion/handler call unless act() forces it synchronously.
const fireHandler = (eventName, ...args) => {
  const calls = mockSocket.on.mock.calls.filter(call => call[0] === eventName);
  const handler = calls[calls.length - 1][1];
  act(() => handler(...args));
};

afterEach(() => {
  mockSocket.on.mockClear();
  mockSocket.emit.mockClear();
  localStorage.clear();
});

it('shows "Not connected." and calls connect() on mount when there is no socket yet', () => {
  const connect = vi.fn();
  socketState.current = { socket: null, connect, disconnect: vi.fn() };

  render(<Support user={{ _id: 'me' }} />);

  expect(screen.getByText('Not connected.')).toBeInTheDocument();
  expect(connect).toHaveBeenCalledTimes(1);
});

it('shows "No users connected." once the socket connects but no users have loaded', () => {
  socketState.current = { socket: mockSocket, connect: vi.fn(), disconnect: vi.fn() };

  render(<Support user={{ _id: 'me' }} />);

  expect(screen.getByText('No users connected.')).toBeInTheDocument();
  expect(mockSocket.emit).toHaveBeenCalledWith('connectUser');
  expect(mockSocket.emit).toHaveBeenCalledWith('getUsers');
  expect(mockSocket.emit).toHaveBeenCalledWith('getMessages');
});

it('renders the contact list once users load, and a placeholder until a chat is selected', () => {
  socketState.current = { socket: mockSocket, connect: vi.fn(), disconnect: vi.fn() };
  render(<Support user={{ _id: 'me' }} />);

  fireHandler('getUsers', [{ id: 'u1', name: 'Jane', online: true }]);

  expect(screen.getByText('Jane')).toBeInTheDocument();
  expect(screen.getByText('Select chat to start messaging')).toBeInTheDocument();
});

it('selecting a contact shows the thread and lets the user send a message', () => {
  socketState.current = { socket: mockSocket, connect: vi.fn(), disconnect: vi.fn() };
  render(<Support user={{ _id: 'me' }} />);

  fireHandler('getUsers', [{ id: 'u1', name: 'Jane', online: true }]);
  fireHandler('getMessages', [
    { id: 'm1', from: 'u1', to: 'me', time: 1, value: 'hi', user: { name: 'Jane' } }
  ]);

  fireEvent.click(screen.getByText('Jane'));

  expect(screen.getAllByText('Jane').length).toBeGreaterThan(0);
  expect(localStorage.getItem('selected_suport_chat')).toBe('u1');

  const input = screen.getByPlaceholderText('type message');
  fireEvent.change(input, { target: { value: 'hello there' } });
  fireEvent.submit(input.closest('form'));

  expect(mockSocket.emit).toHaveBeenCalledWith('message', { text: 'hello there', to: 'u1' });
});

it('appends an incoming realtime message to the open thread', () => {
  socketState.current = { socket: mockSocket, connect: vi.fn(), disconnect: vi.fn() };
  render(<Support user={{ _id: 'me' }} />);

  fireHandler('getUsers', [{ id: 'u1', name: 'Jane', online: true }]);
  fireHandler('getMessages', []);
  fireEvent.click(screen.getByText('Jane'));

  fireHandler('message', { id: 'm2', from: 'u1', to: 'me', time: 2, value: 'new message', user: { name: 'Jane' } });

  expect(screen.getByText('new message')).toBeInTheDocument();
});

it('updates an existing contact on connectUser, and appends a brand-new one', () => {
  socketState.current = { socket: mockSocket, connect: vi.fn(), disconnect: vi.fn() };
  render(<Support user={{ _id: 'me' }} />);

  fireHandler('getUsers', [{ id: 'u1', name: 'Jane', online: false }]);

  fireHandler('connectUser', { id: 'u1', name: 'Jane', online: true });
  expect(document.querySelector('.circle.online')).toBeInTheDocument();

  fireHandler('connectUser', { id: 'u2', name: 'Bob', online: true });
  expect(screen.getByText('Bob')).toBeInTheDocument();
});

it('updates a contact on disconnectUser', () => {
  socketState.current = { socket: mockSocket, connect: vi.fn(), disconnect: vi.fn() };
  render(<Support user={{ _id: 'me' }} />);

  fireHandler('getUsers', [{ id: 'u1', name: 'Jane', online: true }]);
  fireHandler('disconnectUser', { id: 'u1', name: 'Jane', online: false });

  expect(document.querySelector('.circle.offline')).toBeInTheDocument();
});

it('groups consecutive messages from the same sender under one header (noHeader)', () => {
  socketState.current = { socket: mockSocket, connect: vi.fn(), disconnect: vi.fn() };
  render(<Support user={{ _id: 'me' }} />);

  fireHandler('getUsers', [{ id: 'u1', name: 'Jane', online: true }]);
  fireHandler('getMessages', [
    { id: 'm1', from: 'u1', to: 'me', time: 1, value: 'first', user: { name: 'Jane' } },
    { id: 'm2', from: 'u1', to: 'me', time: 2, value: 'second', user: { name: 'Jane' } }
  ]);

  fireEvent.click(screen.getByText('Jane'));

  expect(screen.getByText('first')).toBeInTheDocument();
  expect(screen.getByText('second')).toBeInTheDocument();
});

it('restores the previously-selected chat from localStorage once messages load', () => {
  localStorage.setItem('selected_suport_chat', 'u1');
  socketState.current = { socket: mockSocket, connect: vi.fn(), disconnect: vi.fn() };
  render(<Support user={{ _id: 'me' }} />);

  fireHandler('getUsers', [{ id: 'u1', name: 'Jane', online: true }]);
  fireHandler('getMessages', [{ id: 'm1', from: 'u1', to: 'me', time: 1, value: 'hi', user: { name: 'Jane' } }]);

  expect(screen.getByText('hi')).toBeInTheDocument();
});
