import React, { useState } from 'react';

import Input from '../../Common/Input';
import Button from '../../Common/Button';

// Message compose box for the support-chat feature (see Support/index.js).
const AddMessage = props => {
  const { onSubmit } = props;
  const [message, setMessage] = useState('');

  const handleOnSubmit = e => {
    e.preventDefault();
    // Uses the browser's native alert() here, unlike the rest of the app's
    // form validation (which shows inline field errors or a toast via
    // react-notification-system-redux) — an inconsistency, not a shared
    // pattern.
    if (!message.trim()) {
      return alert('Please type message.');
    }
    onSubmit(message);
    setMessage('');
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <Input
        autoComplete='off'
        type={'text'}
        name={'message'}
        placeholder='type message'
        value={message}
        onInputChange={(_, value) => setMessage(value)}
        inlineElement={<SendButton disabled={!message} />}
      />
    </form>
  );
};

const SendButton = ({ disabled }) => (
  <Button type='submit' disabled={disabled} variant='primary' text='Send' />
);

export default AddMessage;
