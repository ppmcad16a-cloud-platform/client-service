/**
 *
 * BrandsPage
 *
 */

import React from 'react';

import { connect } from 'react-redux';

import actions from '../../actions';

import BrandList from '../../components/Store/BrandList';

// The dedicated /brands page (full brand grid) — distinct from Shop's
// /shop/brand/:slug (a single brand's filtered product list). Linked from
// MiniBrand's "See all".
class BrandsPage extends React.PureComponent {
  componentDidMount() {
    this.props.fetchStoreBrands();
  }

  render() {
    const { brands } = this.props;

    return (
      <div className='brands-page'>
        <BrandList brands={brands} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    brands: state.brand.storeBrands
  };
};

export default connect(mapStateToProps, actions)(BrandsPage);
