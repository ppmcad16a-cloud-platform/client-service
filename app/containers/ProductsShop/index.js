/**
 *
 * ProductsShop
 *
 */

import React from 'react';

import { connect } from 'react-redux';

import actions from '../../actions';

import ProductList from '../../components/Store/ProductList';
import NotFound from '../../components/Common/NotFound';
import LoadingIndicator from '../../components/Common/LoadingIndicator';

// Rendered inside Shop for the bare /shop route (all products, no
// category/brand filter). NOTE: this route has no :slug param at all, so
// `slug` here is always undefined — filterProducts(undefined) just falls
// through to productsFilterOrganizer's default case (reset to
// category: 'all', brand: 'all'), which happens to be the desired "show
// everything" behavior, but not because `slug` is meaningfully used.
class ProductsShop extends React.PureComponent {
  componentDidMount() {
    const slug = this.props.match.params.slug;
    this.props.filterProducts(slug);
  }

  render() {
    const { products, isLoading, authenticated, updateWishlist } = this.props;

    const displayProducts = products && products.length > 0;

    return (
      <div className='products-shop'>
        {isLoading && <LoadingIndicator />}
        {displayProducts && (
          <ProductList
            products={products}
            authenticated={authenticated}
            updateWishlist={updateWishlist}
          />
        )}
        {!isLoading && !displayProducts && (
          <NotFound message='No products found.' />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    products: state.product.storeProducts,
    isLoading: state.product.isLoading,
    authenticated: state.authentication.authenticated
  };
};

export default connect(mapStateToProps, actions)(ProductsShop);
