import { sortOptions } from './store';

it('exposes the storefront sort choices in Newest/High-Low/Low-High order', () => {
  expect(sortOptions).toEqual([
    { value: 0, label: 'Newest First' },
    { value: 1, label: 'Price High to Low' },
    { value: 2, label: 'Price Low to High' }
  ]);
});
