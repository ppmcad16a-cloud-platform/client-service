import React from 'react';
import { render, screen } from '@testing-library/react';

import MessagesList from 'app/components/Manager/Support/MessageList';

// jsdom doesn't implement scrollIntoView; MessageList calls it on every
// mount/update via a ref to auto-scroll to the newest message.
beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

it('shows a "no messages" placeholder when there are none', () => {
  render(<MessagesList user={{ _id: 'me' }} messages={[]} />);

  expect(screen.getByText('No messages found.')).toBeInTheDocument();
});

it("renders the other person's message with their name/avatar/time header", () => {
  const messages = [
    { id: 'm1', from: 'u1', to: 'me', time: 1700000000, value: 'Hi there', user: { name: 'Jane' }, noHeader: false }
  ];

  render(<MessagesList user={{ _id: 'me' }} messages={messages} />);

  expect(screen.getByText('Hi there')).toBeInTheDocument();
  expect(screen.getByText('Jane')).toBeInTheDocument();
  expect(screen.getByText('J')).toBeInTheDocument();
});

it('renders my own message right-aligned without their name header', () => {
  const messages = [
    { id: 'm1', from: 'me', to: 'u1', time: 1700000000, value: 'Hi back', user: { name: 'Me' }, noHeader: false }
  ];

  render(<MessagesList user={{ _id: 'me' }} messages={messages} />);

  expect(screen.getByText('Hi back')).toBeInTheDocument();
  expect(screen.queryByText('Me')).not.toBeInTheDocument();
});

it('hides the repeated name/avatar header for consecutive messages from the same sender (noHeader)', () => {
  const messages = [
    { id: 'm1', from: 'u1', to: 'me', time: 1, value: 'First', user: { name: 'Jane' }, noHeader: false },
    { id: 'm2', from: 'u1', to: 'me', time: 2, value: 'Second', user: { name: 'Jane' }, noHeader: true }
  ];

  render(<MessagesList user={{ _id: 'me' }} messages={messages} />);

  expect(screen.getAllByText('Jane')).toHaveLength(1);
  expect(screen.getAllByText('J')).toHaveLength(1);
});

it('shows no avatar when the sender has no name', () => {
  const messages = [
    { id: 'm1', from: 'u1', to: 'me', time: 1, value: 'Hi', user: {}, noHeader: false }
  ];

  const { container } = render(<MessagesList user={{ _id: 'me' }} messages={messages} />);

  expect(container.querySelector('.avatar')).not.toBeInTheDocument();
});
