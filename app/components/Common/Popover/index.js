/**
 *
 * Popover
 *
 */

import React from 'react';

import { UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap';

// Wraps reactstrap's uncontrolled Popover; `target` must match the id of the
// element it should attach to (see Button's tooltip/popover id handling).
const Popover = props => {
  const { target, placement, popoverTitle, children } = props;

  return (
    // trigger='legacy' opens on click and closes on outside click, rather
    // than reactstrap's default hover-based trigger.
    <UncontrolledPopover placement={placement} target={target} trigger='legacy'>
      {popoverTitle && <PopoverHeader>{popoverTitle}</PopoverHeader>}
      <PopoverBody>{children}</PopoverBody>
    </UncontrolledPopover>
  );
};

Popover.defaultProps = {
  placement: 'top'
};

export default Popover;
