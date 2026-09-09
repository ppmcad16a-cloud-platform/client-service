import { ROLES } from '../constants';

// True only for a merchant whose linked Merchant/Brand has been deactivated
// by an admin (server/routes/api/merchant.js) — used to show a "disabled
// account" state instead of the normal merchant dashboard.
export const isDisabledMerchantAccount = user =>
  user.role === ROLES.Merchant &&
  user.merchant &&
  user.merchant.isActive === false;
