import React from 'react';

// Holds { socket, connect, disconnect } for the live support-chat feature
// (see provider.js) — consumed via useSocket.js rather than useContext
// directly.
const SocketContext = React.createContext();

export default SocketContext;
