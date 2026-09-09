/**
 *
 * Notification
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import Notifications from 'react-notification-system-redux';

import actions from '../../actions';

// Renders the app-wide toast notifications every action creator dispatches
// via react-notification-system-redux (see utils/error.js and the many
// `dispatch(success({...}))` calls throughout the ducks) — mounted once at
// the top of containers/Application.
class Notification extends React.PureComponent {
  componentDidMount() {}

  render() {
    const { notifications } = this.props;

    // NOTE: 'success' toasts are styled red here, which reads as an error
    // color — likely a copy/paste mistake rather than intentional.
    const style = {
      NotificationItem: {
        DefaultStyle: {
          margin: '10px 5px 2px 1px'
        },

        success: {
          color: 'red'
        }
      }
    };
    return <Notifications notifications={notifications} style={style} />;
  }
}

const mapStateToProps = state => {
  return {
    notifications: state.notifications
  };
};

export default connect(mapStateToProps, actions)(Notification);
