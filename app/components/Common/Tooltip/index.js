/**
 *
 * Tooltip
 *
 */

import React from 'react';

import { UncontrolledTooltip } from 'reactstrap';

// Thin wrapper around reactstrap's uncontrolled Tooltip; `target` must match
// the id of the element it should attach to (see Button/Switch's usage).
const Tooltip = props => {
  const { target, placement, children } = props;

  return (
    <UncontrolledTooltip placement={placement} target={target}>
      {children}
    </UncontrolledTooltip>
  );
};

Tooltip.defaultProps = {
  placement: 'top'
};

export default Tooltip;
