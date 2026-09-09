// Sort choices for the storefront's product list (Newest/Price asc/desc),
// matching the `sortOrder` values utils/select.js and Product/actions.js's
// getSortOrder expect. (Lives in utils/store.js despite the name — nothing
// to do with containers/Cart's own store-related logic.)
export const sortOptions = [
  { value: 0, label: 'Newest First' },
  { value: 1, label: 'Price High to Low' },
  { value: 2, label: 'Price Low to High' }
];
