import { arrayBufferToBase64 } from './base64';

it('converts a Mongo Buffer + contentType object into a data: URI', () => {
  // Bytes for the ASCII string "Hello" — btoa('Hello') === 'SGVsbG8='.
  const buffer = {
    data: { data: [72, 101, 108, 108, 111] },
    contentType: 'image/png'
  };

  expect(arrayBufferToBase64(buffer)).toBe('data:image/png;base64,SGVsbG8=');
});
