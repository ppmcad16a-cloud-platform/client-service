/**
 *
 * DropdownConfirm
 *
 */

import React from 'react';

import {
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownToggle
} from 'reactstrap';

// A dropdown toggled by a text label (not a button/caret icon alone) whose
// menu content is entirely up to the caller via `children` — used for
// things like "are you sure?" confirmation menus (e.g. delete actions).
const DropdownConfirm = props => {
  const { className, label, children } = props;

  return (
    <div className={`dropdown-confirm ${className}`}>
      <UncontrolledButtonDropdown>
        <DropdownToggle nav>
          <div className='dropdown-action sm'>
            {label}
            <span className='fa fa-chevron-down dropdown-caret'></span>
          </div>
        </DropdownToggle>
        <DropdownMenu right>{children}</DropdownMenu>
      </UncontrolledButtonDropdown>
    </div>
  );
};

DropdownConfirm.defaultProps = {
  label: ''
};

export default DropdownConfirm;
