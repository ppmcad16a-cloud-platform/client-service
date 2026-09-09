/**
 *
 * base64.js
 * this helper formulate buffer data to base64 string
 *
 * Converts a Mongo-style { data: Buffer, contentType } object (as returned
 * for e.g. binary-stored images) into a `data:<type>;base64,...` URI an
 * <img> tag can use directly as its `src`.
 */

export const arrayBufferToBase64 = buffer => {
  let binary = '';
  let bytes = [].slice.call(new Uint8Array(buffer.data.data));
  bytes.forEach((b) => binary += String.fromCharCode(b));
  return `data:${buffer.contentType};base64,${window.btoa(binary)}`;
};
