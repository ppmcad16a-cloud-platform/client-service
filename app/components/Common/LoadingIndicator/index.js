/**
 *
 * LoadingIndicator
 *
 */

import React from 'react';

// Spinner used throughout the app for in-flight requests. `inline` switches
// it from a full-page fixed overlay to sitting in normal document flow;
// `backdrop` only applies (visually) when it's the fixed overlay.
const LoadingIndicator = props => {
  const { inline, backdrop } = props;

  return (
    <div
      className={`spinner-container${
        inline ? ' position-relative' : ' position-fixed overlay'
      } ${backdrop ? 'backdrop' : ''}`}
    >
      <div
        className={`spinner${
          inline ? ' position-relative' : ' position-fixed overlay'
        }`}
      ></div>
    </div>
  );
};

LoadingIndicator.defaultProps = {
  inline: false,
  backdrop: false
};

export default LoadingIndicator;
