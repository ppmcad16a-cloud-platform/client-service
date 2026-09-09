it('derives SOCKET_URL from the current host when it is not localhost', async () => {
  const originalLocation = window.location;
  Object.defineProperty(window, 'location', {
    value: { ...originalLocation, host: 'example.com' },
    writable: true,
    configurable: true
  });

  vi.resetModules();
  const { SOCKET_URL } = await import('./index');

  expect(SOCKET_URL).toBe('example.com');

  Object.defineProperty(window, 'location', {
    value: originalLocation,
    writable: true,
    configurable: true
  });
});

it('uses the local dev socket URL when the host is localhost', async () => {
  vi.resetModules();
  const { SOCKET_URL } = await import('./index');

  expect(SOCKET_URL).toBe('http://127.0.0.1:3000');
});
