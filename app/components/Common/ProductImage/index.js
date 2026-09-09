/**
 *
 * ProductImage
 *
 */

import React from 'react';

// Default local asset shown whenever a product has no imageUrl set, or its
// imageUrl fails to actually load (dead link, CORS block, host down, etc).
export const DEFAULT_PRODUCT_IMAGE = '/images/placeholder-image.png';

// Every place in the app that renders a product's image should go through
// here rather than writing its own `src={imageUrl ? imageUrl : placeholder}`
// — that only covers a missing link, not a broken one. This also gives the
// whole app a single spot to change later: swapping sellers pasting a public
// link for real uploads to our own cloud storage only changes what value
// `src` receives (still just a URL string), not how it's displayed.
const ProductImage = ({ src, alt = '', className }) => {
  const handleError = event => {
    // Prevents an infinite loop if the placeholder asset itself is missing.
    event.target.onerror = null;
    event.target.src = DEFAULT_PRODUCT_IMAGE;
  };

  return (
    <img
      className={className}
      src={src || DEFAULT_PRODUCT_IMAGE}
      alt={alt}
      onError={handleError}
    />
  );
};

export default ProductImage;
