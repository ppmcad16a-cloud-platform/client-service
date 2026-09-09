/**
 *
 * ComingSoon
 *
 */

import React from 'react';

// Generic placeholder wrapper for unfinished/stubbed-out pages (e.g.
// Shipping) — just a heading plus whatever children are passed in.
const ComingSoon = props => {
  return (
    <div className='coming-soon'>
      <h3>Coming soon</h3>
      {props.children}
    </div>
  );
};

export default ComingSoon;
