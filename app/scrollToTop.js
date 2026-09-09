/**
 *
 * scrollToTop.js
 * scroll restoration
 *
 * Wraps <Application /> (see app.js) so every route change scrolls the page
 * back to the top — otherwise React Router preserves scroll position across
 * navigations, which reads oddly for a multi-page-feeling SPA like this one.
 */

import React from 'react';

import { withRouter } from 'react-router-dom';

class ScrollToTop extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      window.scroll({
        top: 0,
        behavior: 'smooth'
      });
    }
  }

  render() {
    return this.props.children;
  }
}

export default withRouter(ScrollToTop);
