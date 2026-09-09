/**
 *
 * error.js
 * This is a generic error handler, it receives the error returned from the server and present it on a pop up
 *
 * Called from nearly every action creator's catch block. Branches on the
 * HTTP status of the failed request: 400 shows the server's own error
 * message; 404 is deliberately silent (no toast — treated as an expected
 * "not found", not a failure worth interrupting the user for); 401 signs the
 * user out (their token was rejected) in addition to showing a toast; 403
 * just shows a generic "forbidden" toast.
 */

import { error } from 'react-notification-system-redux';

import { signOut } from '../containers/Login/actions';

const handleError = (err, dispatch, title = '') => {
  const unsuccessfulOptions = {
    title: `${title}`,
    message: ``,
    position: 'tr',
    autoDismiss: 1
  };

  if (err.response) {
    if (err.response.status === 400) {
      unsuccessfulOptions.title = title ? title : 'Please Try Again!';
      unsuccessfulOptions.message = err.response.data.error;
      dispatch(error(unsuccessfulOptions));
    } else if (err.response.status === 404) {
      // unsuccessfulOptions.title =
      //   err.response.data.message ||
      //   'Your request could not be processed. Please try again.';
      // dispatch(error(unsuccessfulOptions));
    } else if (err.response.status === 401) {
      unsuccessfulOptions.message = 'Unauthorized Access! Please login again';
      dispatch(signOut());
      dispatch(error(unsuccessfulOptions));
    } else if (err.response.status === 403) {
      unsuccessfulOptions.message =
        'Forbidden! You are not allowed to access this resource.';
      dispatch(error(unsuccessfulOptions));
    }
  } else if (err.message) {
    unsuccessfulOptions.message = err.message;
    dispatch(error(unsuccessfulOptions));
  } else {
    // fallback
    unsuccessfulOptions.message =
      'Your request could not be processed. Please try again.';
  }
};

export default handleError;
