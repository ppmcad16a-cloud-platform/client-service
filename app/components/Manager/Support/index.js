import React, { useEffect, useState } from 'react';
import { Row, Col } from 'reactstrap';

import { useSocket } from '../../../contexts/Socket';
import AddMessage from './AddMessage';
import MessageList from './MessageList';
import UserList from './UserList';
import NotFound from '../../Common/NotFound';

// Top-level support-chat container — connects the socket (see
// contexts/Socket + server/socket/), holds all chat state (contacts,
// messages, currently selected conversation), and composes UserList/
// MessageList/AddMessage. All chat "storage" is the in-memory
// server/socket/support.js state; nothing here is persisted to a database.
const Support = props => {
  const { user: me } = props;
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeChat, setActiveChat] = useState([]);
  const { socket, connect, disconnect } = useSocket();

  // Opens the socket connection once, on mount.
  useEffect(() => {
    connect();
  }, []);

  // Once a socket exists, request initial state from the server and start
  // listening for updates; tears the connection down again on unmount.
  useEffect(() => {
    if (socket) {
      socket.emit('connectUser');
      socket.emit('getUsers');
      socket.emit('getMessages');
      socket.on('getUsers', users => {
        setUsers(users);
      });
      socket.on('getMessages', msgs => {
        setMessages(prevState => [...prevState, ...msgs]);
      });
      socket.on('message', onMessage);
    }

    return () => {
      disconnect();
    };
  }, [socket]);

  /* user connect/disconnect implementation */
  useEffect(() => {
    if (socket && users) {
      socket.on('connectUser', user => {
        const index = users.findIndex(u => u.id === user.id);
        let newUsers = [...users];
        if (index !== -1) {
          newUsers[index] = user;
        } else {
          newUsers = [...newUsers, user];
        }
        setUsers(newUsers);
      });

      socket.on('disconnectUser', user => {
        const index = users.findIndex(u => u.id === user.id);
        const newUsers = [...users];
        if (index !== -1) {
          newUsers[index] = user;
        }
        setUsers(newUsers);
      });
    }
  }, [socket, users]);

  // Once messages have loaded, restore whichever conversation was open
  // before (persisted in localStorage under 'selected_suport_chat' — note
  // the key's own typo), or just re-run selectUser to refresh the currently
  // open one now that more messages exist.
  useEffect(() => {
    if (messages.length > 0) {
      if (selectedUser) {
        selectUser(selectedUser);
      } else {
        const user_id = localStorage.getItem('selected_suport_chat');
        if (user_id) {
          const user = users.find(u => u.id === user_id);
          if (user) selectUser(user);
        }
      }
    }
  }, [messages]);

  const onMessage = message => {
    setMessages(prevState => [...prevState, message]);
  };

  const selectUser = user => {
    setSelectedUser(user);
    const msgs = getUserMsgs(user);
    setActiveChat(msgs);
    localStorage.setItem('selected_suport_chat', user.id);
  };

  // Filters the full message history down to the one-on-one thread with
  // `user`, sorted chronologically, and flags consecutive messages from the
  // same sender with noHeader so MessageList can visually group them
  // (avatar/name only shown once per run). NOTE: mutates each message
  // object in place (`currentMsg.noHeader = ...`) rather than building new
  // objects — harmless here since these are freshly filtered references,
  // but not a pure function.
  const getUserMsgs = user => {
    const sentMsgs = messages.filter(m => m.from === user.id);
    const receivedMsgs = messages.filter(m => m.to === user.id);
    const msgs = [...sentMsgs, ...receivedMsgs].sort((a, b) => a.time - b.time);
    const updatedMsgs = [];
    for (let i = 0; i < msgs.length; i++) {
      const previousMsg = msgs[i - 1];
      const currentMsg = msgs[i];
      if (previousMsg && previousMsg.from === currentMsg.from && i !== 0) {
        currentMsg.noHeader = true;
      } else {
        currentMsg.noHeader = false;
      }
      updatedMsgs.push(currentMsg);
    }
    return updatedMsgs;
  };

  const onMessageSubmit = message => {
    if (!selectedUser) return;
    socket.emit('message', {
      text: message,
      to: selectedUser?.id
    });
  };

  return (
    <>
      {socket ? (
        <>
          {users.length > 0 ? (
            <Row>
              <Col xs='12' md='4' xl='3'>
                <UserList
                  users={users}
                  selectedUser={selectedUser}
                  selectUser={selectUser}
                />
              </Col>
              <Col xs='12' md='8' xl='9'>
                {selectedUser ? (
                  <div>
                    <h4 className='text-center text-md-left mt-3 mt-md-0'>
                      {selectedUser?.name}
                    </h4>
                    <MessageList user={me} messages={activeChat} />
                    <AddMessage socket={socket} onSubmit={onMessageSubmit} />
                  </div>
                ) : (
                  <div className='d-flex flex-column justify-content-center h-100 p-4 p-md-0'>
                    <NotFound message='Select chat to start messaging' />
                  </div>
                )}
              </Col>
            </Row>
          ) : (
            <NotFound message='No users connected.' />
          )}
        </>
      ) : (
        <NotFound message='Not connected.' />
      )}
    </>
  );
};

export default Support;
