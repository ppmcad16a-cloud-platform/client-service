import { SocketProvider, SocketContext, useSocket } from './index';

it('re-exports the Socket context module public surface', () => {
  expect(SocketProvider).toBeDefined();
  expect(SocketContext).toBeDefined();
  expect(useSocket).toBeDefined();
});
