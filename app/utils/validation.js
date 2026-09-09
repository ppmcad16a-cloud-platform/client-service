import Validator from 'validatorjs';
import DOMPurify from 'dompurify';

// Thin wrapper around validatorjs that normalizes its result into
// { isValid, errors } — every form's action creator (signUp, login, etc.)
// calls this with its own rules/messages before submitting to the API.
export const allFieldsValidation = (data, rules, options) => {
  const validation = new Validator(data, rules, options);
  const validationResponse = { isValid: validation.passes() };
  if (!validationResponse.isValid) {
    validationResponse.errors = validation.errors.all();
  }

  return validationResponse;
};

// Strips HTML from every field's value before it's sent to the server, to
// avoid persisting/re-rendering unsanitized user input elsewhere in the app.
// NOTE: `typeof field === 'string'` is checking the *key* from `for...in`,
// which is always a string — so this condition is always true and every
// field gets sanitized regardless of its own value's type (e.g. numbers get
// run through DOMPurify.sanitize too, which is harmless but not what the
// check appears to be testing for).
export const santizeFields = data => {
  const fields = { ...data };

  for (const field in fields) {
    if (typeof field === 'string') {
      fields[field] = DOMPurify.sanitize(fields[field], {
        USE_PROFILES: { html: false }
      });
    }
  }
  return fields;
};
