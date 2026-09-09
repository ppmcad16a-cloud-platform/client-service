import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { contactFormChange, contactUs } from './actions';
import { CONTACT_FORM_CHANGE, SET_CONTACT_FORM_ERRORS, CONTACT_FORM_RESET } from './constants';
import { API_URL } from '../../constants';

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
});

it('contactFormChange builds a keyed payload', () => {
  expect(contactFormChange('name', 'Jane')).toEqual({
    type: CONTACT_FORM_CHANGE,
    payload: { name: 'Jane' }
  });
});

describe('contactUs', () => {
  const validContact = { name: 'Jane', email: 'jane@test.com', message: 'Hello there, this is a test.' };

  it('rejects invalid form data without calling the API', async () => {
    const dispatch = vi.fn();

    await contactUs()(dispatch, () => ({ contact: { contactFormData: {} } }));

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: SET_CONTACT_FORM_ERRORS })
    );
  });

  it('submits the message, resets the form, and shows a success toast', async () => {
    mock.onPost(`${API_URL}/contact/add`).reply(200, { message: 'Received!' });
    const dispatch = vi.fn();

    await contactUs()(dispatch, () => ({ contact: { contactFormData: validContact } }));

    const types = dispatch.mock.calls.map(call => call[0].type);
    expect(types).toEqual([CONTACT_FORM_RESET, 'RNS_SHOW_NOTIFICATION']);
  });

  it('handles a failed submission', async () => {
    mock.onPost(`${API_URL}/contact/add`).reply(400, { error: 'Bad' });
    const dispatch = vi.fn();

    await contactUs()(dispatch, () => ({ contact: { contactFormData: validContact } }));

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'RNS_SHOW_NOTIFICATION', message: 'Bad' })
    );
  });
});
