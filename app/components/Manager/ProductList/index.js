/**
 *
 * ProductList
 *
 */

import React from 'react';

import { Link } from 'react-router-dom';

import ProductImage from '../../Common/ProductImage';

// Dashboard product list (admin sees all, merchant sees their own — scoping
// happens server-side in routes/api/product.js). Each entry links straight
// to its edit page.
const ProductList = props => {
  const { products } = props;

  return (
    <div className='p-list'>
      {products.map((product, index) => (
        <Link
          to={`/dashboard/product/edit/${product._id}`}
          key={index}
          className='d-flex flex-row align-items-center mx-0 mb-3 product-box'
        >
          <ProductImage
            className='item-image'
            src={product?.imageUrl}
            alt={product?.name}
          />
          <div className='d-flex flex-column justify-content-center px-3 text-truncate'>
            <h4 className='text-truncate'>{product.name}</h4>
            <p className='mb-2 text-truncate'>{product.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductList;
