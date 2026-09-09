// Cross-cutting frontend constants, separate from each container's own
// per-feature constants.js (which only holds that feature's action types).

// Base API URL, baked in at build time from client/.env via dotenv-webpack —
// changing it requires a rebuild, not just a runtime env change.
export const API_URL = process.env.API_URL;

// Assumes the server always runs on port 3000 locally; in any other
// environment it just reuses whatever host served the page.
export const SOCKET_URL =
  window.location.host.indexOf('localhost') >= 0
    ? 'http://127.0.0.1:3000'
    : window.location.host;

export const ROLES = {
  Admin: 'ROLE ADMIN',
  Member: 'ROLE MEMBER',
  Merchant: 'ROLE MERCHANT'
};

// localStorage keys backing the cart (see containers/Cart), kept in sync
// with Redux state and read by the cross-tab 'storage' event listener in
// containers/Application.
export const CART_ITEMS = 'cart_items';
export const CART_TOTAL = 'cart_total';
export const CART_ID = 'cart_id';

export const CART_ITEM_STATUS = {
  Processing: 'Processing',
  Shipped: 'Shipped',
  Delivered: 'Delivered',
  Cancelled: 'Cancelled',
  Not_processed: 'Not processed'
};

export const MERCHANT_STATUS = {
  Rejected: 'Rejected',
  Approved: 'Approved',
  Waiting_Approval: 'Waiting Approval'
};

export const REVIEW_STATUS = {
  Rejected: 'Rejected',
  Approved: 'Approved',
  Waiting_Approval: 'Waiting Approval'
};

// Only 'Email' is possible today — used to also distinguish Google/Facebook
// OAuth signups before that feature was removed.
export const EMAIL_PROVIDER = {
  Email: 'Email'
};
