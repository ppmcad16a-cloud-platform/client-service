import React, { useEffect, useRef, memo } from 'react';

import { getMemoizedRandomColors } from '../../../utils';
import { formatTime } from '../../../utils/date';
import NotFound from '../../Common/NotFound';

// Renders the message thread for the currently selected support-chat user
// (see Support/index.js, which computes `noHeader` per message before
// passing it in here — grouping consecutive messages from the same sender
// under one header).
const MessagesList = props => {
  const { user, messages } = props;
  const messagesEndRef = useRef(null);
  const msgsLength = messages.length;
  const emptyMsgs = msgsLength > 0 ? false : true;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  // Auto-scrolls to the newest message whenever the message count changes
  // (new message sent/received) — not on every render.
  useEffect(() => {
    scrollToBottom();
  }, [msgsLength]);

  const renderMessages = () =>
    messages.map(message => (
      <Message
        key={message.id}
        message={message}
        isMe={message.from === user._id}
        noHeader={message.noHeader}
      />
    ));

  return (
    <>
      {messages && !emptyMsgs ? (
        <div className={`m-list ${!emptyMsgs ? '' : 'empty'}`}>
          {renderMessages()}
          <div ref={messagesEndRef} />
        </div>
      ) : (
        <div className='my-4'>
          <NotFound message='No messages found.' />
        </div>
      )}
    </>
  );
};

// memo'd since a chat can re-render frequently (new messages arriving) and
// most existing message bubbles don't need to re-render each time.
const Message = memo(props => {
  const { message, isMe, noHeader } = props;

  // Same "initial-on-a-deterministic-color" avatar pattern as
  // ReviewList/index.js — no real uploaded avatars anywhere in this app.
  const getAvatar = m => {
    const color = getMemoizedRandomColors(m.from);

    if (m.user.name) {
      return (
        <div
          className='d-flex flex-column justify-content-center align-items-center fw-normal text-white avatar '
          style={{ backgroundColor: color ? color : 'red' }}
        >
          {m.user.name.charAt(0)}
        </div>
      );
    }
  };

  return (
    <div className='m-container'>
      <div
        className={`d-flex ${
          isMe ? 'justify-content-end' : 'justify-content-start'
        }`}
      >
        {!isMe && (
          <div className='mr-2 avatar-box'>
            {!noHeader && <> {getAvatar(message)}</>}
          </div>
        )}

        <div>
          {isMe ? (
            <div className='mb-2 text-right text-black'>
              {formatTime(message.time)}
            </div>
          ) : (
            <div className={`d-flex mb-2 text-right`}>
              {!noHeader && (
                <>
                  <p className={`mb-0 fw-normal text-black`}>
                    {message.user.name}
                  </p>
                  <div className='ml-2 text-black'>
                    {formatTime(message.time)}
                  </div>
                </>
              )}
            </div>
          )}

          <p className={`${isMe ? 'me' : ''} m-box`}>{message.value}</p>
        </div>
      </div>
    </div>
  );
});

export default MessagesList;
