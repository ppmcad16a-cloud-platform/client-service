import DOMPurify from 'dompurify';

import { allFieldsValidation, santizeFields } from './validation';

describe('allFieldsValidation', () => {
  it('reports valid when every rule passes', () => {
    const result = allFieldsValidation(
      { name: 'Jane' },
      { name: 'required' }
    );

    expect(result.isValid).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  it('reports errors when a rule fails', () => {
    const result = allFieldsValidation(
      { name: '' },
      { name: 'required' },
      { 'required.name': 'Name is required.' }
    );

    expect(result.isValid).toBe(false);
    expect(result.errors.name).toEqual(['Name is required.']);
  });
});

describe('santizeFields', () => {
  it('strips HTML from a string field the same way DOMPurify would directly', () => {
    const dirty = '<b>Hello</b><script>alert(1)</script>';
    const result = santizeFields({ bio: dirty });

    expect(result.bio).toBe(
      DOMPurify.sanitize(dirty, { USE_PROFILES: { html: false } })
    );
  });

  it('also runs non-string field values through DOMPurify (existing bug: the typeof check tests the for...in key, not the value, so it is always true)', () => {
    const result = santizeFields({ age: 25 });

    expect(result.age).toBe(
      DOMPurify.sanitize(25, { USE_PROFILES: { html: false } })
    );
  });

  it('does not mutate the original object', () => {
    const original = { bio: '<b>Hi</b>' };
    santizeFields(original);
    expect(original.bio).toBe('<b>Hi</b>');
  });
});
