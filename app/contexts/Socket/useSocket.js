import { useContext } from 'react';

import SocketContext from './context';

// Convenience hook: `const { socket, connect, disconnect } = useSocket();`
// instead of importing SocketContext + useContext everywhere it's needed.
const useSocket = () => useContext(SocketContext);

export default useSocket;
