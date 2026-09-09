import handleError from './error';

describe('handleError', () => {
  it('shows the server error message on a 400, defaulting the title', () => {
    const dispatch = vi.fn();
    const err = { response: { status: 400, data: { error: 'Bad input' } } };

    handleError(err, dispatch);

    expect(dispatch).toHaveBeenCalledTimes(1);
    const action = dispatch.mock.calls[0][0];
    expect(action.title).toBe('Please Try Again!');
    expect(action.message).toBe('Bad input');
  });

  it('uses a custom title on a 400 when one is given', () => {
    const dispatch = vi.fn();
    const err = { response: { status: 400, data: { error: 'Bad input' } } };

    handleError(err, dispatch, 'Custom Title');

    const action = dispatch.mock.calls[0][0];
    expect(action.title).toBe('Custom Title');
  });

  it('is silent on a 404 (no dispatch at all)', () => {
    const dispatch = vi.fn();
    const err = { response: { status: 404, data: {} } };

    handleError(err, dispatch);

    expect(dispatch).not.toHaveBeenCalled();
  });

  it('signs the user out and shows a toast on a 401', () => {
    const dispatch = vi.fn();
    const err = { response: { status: 401, data: {} } };

    handleError(err, dispatch);

    expect(dispatch).toHaveBeenCalledTimes(2);
    // First call is the signOut() thunk (a function); second is the toast action.
    expect(typeof dispatch.mock.calls[0][0]).toBe('function');
    expect(dispatch.mock.calls[1][0].message).toMatch(/unauthorized/i);
  });

  it('shows a generic forbidden toast on a 403', () => {
    const dispatch = vi.fn();
    const err = { response: { status: 403, data: {} } };

    handleError(err, dispatch);

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch.mock.calls[0][0].message).toMatch(/forbidden/i);
  });

  it('does nothing for a response status it does not branch on', () => {
    const dispatch = vi.fn();
    const err = { response: { status: 500, data: {} } };

    handleError(err, dispatch);

    expect(dispatch).not.toHaveBeenCalled();
  });

  it('shows the error message for a non-HTTP error (e.g. a network error)', () => {
    const dispatch = vi.fn();
    const err = { message: 'Network Error' };

    handleError(err, dispatch);

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch.mock.calls[0][0].message).toBe('Network Error');
  });

  it('does not dispatch anything for an error with neither a response nor a message', () => {
    const dispatch = vi.fn();

    handleError({}, dispatch);

    // The fallback branch sets a message internally but never actually
    // dispatches it — a real gap in this function, not fixed here.
    expect(dispatch).not.toHaveBeenCalled();
  });
});
