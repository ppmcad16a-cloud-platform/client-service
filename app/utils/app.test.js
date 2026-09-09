import { isDisabledMerchantAccount } from './app';
import { ROLES } from '../constants';

describe('isDisabledMerchantAccount', () => {
  it('is true for a merchant whose linked merchant/brand was deactivated', () => {
    const user = { role: ROLES.Merchant, merchant: { isActive: false } };
    expect(isDisabledMerchantAccount(user)).toBe(true);
  });

  it('is false for a merchant whose linked merchant/brand is active', () => {
    const user = { role: ROLES.Merchant, merchant: { isActive: true } };
    expect(isDisabledMerchantAccount(user)).toBe(false);
  });

  it('is false when there is no linked merchant at all', () => {
    const user = { role: ROLES.Merchant, merchant: null };
    expect(isDisabledMerchantAccount(user)).toBeFalsy();
  });

  it('is false for a non-merchant user', () => {
    const user = { role: ROLES.Member, merchant: { isActive: false } };
    expect(isDisabledMerchantAccount(user)).toBe(false);
  });
});
