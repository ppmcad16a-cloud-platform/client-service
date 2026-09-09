/**
 *
 * MerchantSearch
 *
 */

import React from 'react';

import SearchBar from '../../Common/SearchBar';

// Search box for the admin merchant-applications dashboard, matching
// routes/api/merchant.js's /search regex across email/phone/brand/status.
const MerchantSearch = props => {
  return (
    <div className='mb-3'>
      <SearchBar
        name='merchant'
        placeholder='Type email, phone number, brand or status'
        btnText='Search'
        onSearch={props.onSearch}
        onBlur={props.onBlur}
        onSearchSubmit={props.onSearchSubmit}
      />
    </div>
  );
};

export default MerchantSearch;
