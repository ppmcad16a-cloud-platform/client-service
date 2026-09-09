/**
 *
 * ProductImageField
 *
 */

import React from 'react';

import Input from '../Input';
import ProductImage from '../ProductImage';

// Add/Edit product forms' "how do we get this product's image" control,
// kept in its own component on purpose. Today it's just a text field for a
// publicly-accessible link the seller provides, with a live preview (which
// also doubles as an immediate check that the link actually loads). If file
// uploads to our own cloud storage are added later, only this component
// needs to change (e.g. swap/augment the text field for a file picker that
// uploads and then calls onInputChange with the resulting URL) — the
// surrounding form, the Product duck, and every place that displays the
// image (see ProductImage) all just keep working off the same `imageUrl`
// string and don't need to know where it came from.
const ProductImageField = ({ value, error, onInputChange }) => (
  <div className='product-image-field'>
    <Input
      type={'text'}
      error={error}
      label={'Image URL'}
      name={'imageUrl'}
      placeholder={'https://example.com/product-photo.jpg'}
      value={value}
      onInputChange={onInputChange}
    />
    <div className='product-image-field-preview mt-2'>
      <ProductImage
        className='item-image'
        src={value}
        alt='Product image preview'
      />
    </div>
  </div>
);

export default ProductImageField;
