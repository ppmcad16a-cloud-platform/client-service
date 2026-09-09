/**
 *
 * SearchResultMeta
 *
 */

import React from 'react';

// Tiny "<count> <label>" line (e.g. "12 results") shown above search results
// across the dashboard's various search views.
const SearchResultMeta = props => {
  const { count, label } = props;

  return (
    <p className='fw-normal'>
      {count} {label}
    </p>
  );
};

export default SearchResultMeta;
