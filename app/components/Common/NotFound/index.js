/**
 *
 * NotFound
 *
 */

import React from 'react';

// Generic "nothing here" placeholder used inside lists/pages (e.g. an empty
// search result) — distinct from Page404, which is specifically the
// unmatched-route fallback.
const NotFound = props => {
  const { message, className, children } = props;
  return (
    <div className={`not-found ${className}`}>
      {message ? message : children}
    </div>
  );
};

NotFound.defaultProps = {
  className: ''
};

export default NotFound;
