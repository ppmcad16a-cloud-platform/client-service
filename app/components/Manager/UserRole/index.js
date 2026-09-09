/**
 *
 * UserRole
 *
 */

import React from 'react';

import { ROLES } from '../../../constants';
import Badge from '../../Common/Badge';

// Renders a colored Badge for a user's role — Member is the fallback/default
// case (no explicit ROLES.Member check needed since it's the only remaining
// possibility once Admin/Merchant are ruled out).
const UserRole = props => {
  const { className, user } = props;

  return (
    <>
      {user.role === ROLES.Admin ? (
        <Badge variant='primary' className={className}>
          Admin
        </Badge>
      ) : user.role === ROLES.Merchant ? (
        <Badge variant='dark' className={className}>
          Merchant
        </Badge>
      ) : (
        <Badge className={className}>Member</Badge>
      )}
    </>
  );
};

UserRole.defaultProps = {
  className: ''
};

export default UserRole;
