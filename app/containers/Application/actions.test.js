import { defaultAction } from './actions';
import { DEFAULT_ACTION } from './constants';

it('returns a plain DEFAULT_ACTION (vestigial, never dispatched by the app)', () => {
  expect(defaultAction()).toEqual({ type: DEFAULT_ACTION });
});
