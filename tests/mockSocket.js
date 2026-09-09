// A minimal fake Socket.IO client instance, covering the methods/properties
// this app actually touches (contexts/Socket/provider.js,
// components/Manager/Support/*). Test files still need their own
// `vi.mock('socket.io-client', () => ({ default: vi.fn(() => instance) }))`
// call — `vi.mock` is hoisted to the top of the file and can't be wrapped
// in a shared helper function — but can import this to build the mocked
// instance consistently instead of redefining it per file.
export const createMockSocketInstance = () => ({
  connect: vi.fn(),
  close: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
  emit: vi.fn(),
  auth: {}
});
