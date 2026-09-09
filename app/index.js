/**
 *
 * index.js
 * This is the entry file for the application — the sole webpack entry point
 * (see client/webpack/webpack.common.js) and the only file that touches
 * ReactDOM directly. Everything else composes underneath <App />.
 */

import React from 'react';
import ReactDOM from 'react-dom';

import App from './app';

ReactDOM.render(<App />, document.getElementById('root'));
