/**
 *
 * AddToWishList
 *
 */

import React from 'react';

import Checkbox from '../../Common/Checkbox';
import { HeartIcon } from '../../Common/Icon';

// Heart-shaped wishlist toggle, implemented as a styled Checkbox rather than
// a plain button — `checked`/`onChange` map to the product's liked state.
// `enabled` gates it off for logged-out users (no wishlist without an
// account).
const AddToWishList = props => {
  const { id, liked, enabled, updateWishlist } = props;

  return (
    <div className='add-to-wishlist'>
      <Checkbox
        id={`checkbox_${id}`}
        name={'wishlist'}
        disabled={!enabled}
        checked={liked}
        label={<HeartIcon />}
        onChange={(_, value) => {
          updateWishlist(value, id);
        }}
      />
    </div>
  );
};

export default AddToWishList;
