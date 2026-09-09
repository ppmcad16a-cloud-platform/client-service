import SocketContext from './context';

it('is a React context object', () => {
  expect(SocketContext.Provider).toBeDefined();
  expect(SocketContext.Consumer).toBeDefined();
});
