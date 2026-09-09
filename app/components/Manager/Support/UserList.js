import React from 'react';
import Button from '../../Common/Button';

// Support-chat contact list (not to be confused with the dashboard's own
// UserList/index.js, an unrelated "all registered users" admin view). Shows
// an online/offline indicator per contact, sourced from
// server/socket/support.js's in-memory presence tracking.
const UserList = props => {
  const { users, selectedUser, selectUser } = props;
  if (!users) return null;

  const _selectUser = u => {
    selectUser(u);
  };

  return (
    <ul className='u-list'>
      {users.map((u, i) => {
        const isSelected = selectedUser?.id === u.id;
        const isOnline = u.online ? true : false;

        return (
          <li className={isSelected ? 'selected' : 'not-selected'} key={i}>
            <Button
              variant='none'
              borderless
              text={u.name}
              onClick={() => _selectUser(u)}
              // `disabled={!isOnline}` is commented out — offline contacts
              // show a gray dot but are still fully clickable/selectable,
              // so you can open a chat with (and message) an offline user.
              iconDirection='right'
              icon={
                <span
                  className={`circle ${isOnline ? 'online' : 'offline'}`}
                ></span>
              }
            />
          </li>
        );
      })}
    </ul>
  );

  // return (
  //   <>
  //     {users.filter(x => x._id !== user._id).length === 0 && (
  //       <MessageBox>No Online User Found</MessageBox>
  //     )}
  //     <ul>
  //       {users
  //         .filter(x => x._id !== user._id)
  //         .map((user, index) => (
  //           <li
  //             style={{ animationDelay: `0.2s` }}
  //             key={index}
  //             className={
  //               user._id === selectedUser?._id
  //                 ? `chatlist-item active `
  //                 : 'chatlist-item'
  //             }
  //           >
  //             <button
  //               className='block'
  //               type='button'
  //               onClick={() => selectUser(user)}
  //             >
  //               {user.name}
  //             </button>
  //             <div>
  //               <span
  //                 className={
  //                   user.unread ? 'unread' : user.online ? 'online' : 'offline'
  //                 }
  //               />
  //             </div>
  //           </li>
  //         ))}
  //     </ul>
  //   </>
  // );
};

export default UserList;
