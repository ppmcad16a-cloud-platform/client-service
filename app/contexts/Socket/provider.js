import React, { useState } from 'react';

import io from 'socket.io-client';

import SocketContext from './context';
import { SOCKET_URL } from '../../constants';

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  // No-op (and thus no connection at all) for a logged-out user — the
  // support-chat socket requires the same JWT the REST API uses, sent via
  // `socket.auth` and verified server-side in server/socket/index.js.
  // `autoConnect: false` means nothing happens until `.connect()` is
  // called explicitly below.
  const connect = () => {
    const token = localStorage.getItem('token');
    const sk = io(SOCKET_URL, {
      autoConnect: false
    });

    if (token) {
      sk.auth = { token };
      sk.connect();
      sk.auth; // no-op: reads the property without using it
      setSocket(sk);
    }
  };

  const disconnect = () => {
    if (socket) {
      socket.close();
    }
  };

  return (
    <SocketContext.Provider value={{ socket, connect, disconnect }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
