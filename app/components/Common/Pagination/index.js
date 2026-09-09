/**
 *
 * Pagination
 *
 */

import React from 'react';
import ReactPaginate from 'react-paginate';

// Thin wrapper around react-paginate with this app's class names wired in.
// `onPagination` is the same callback signature used by each list page's
// advanced-filter reducer (e.g. Product/actions.js's filterProducts), where
// the first arg names which filter changed.
const Pagination = props => {
  const { totalPages, onPagination } = props;

  // react-paginate's `selected` is 0-indexed; the API's `page` query param
  // is 1-indexed.
  const handlePageClick = event => {
    onPagination('pagination', event.selected + 1);
  };

  return (
    <div className='pagination-box'>
      <ReactPaginate
        nextLabel='next >'
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={totalPages} // The total number of pages.
        previousLabel='< previous'
        pageClassName='page-item'
        pageLinkClassName='page-link'
        previousClassName='page-item'
        previousLinkClassName='page-link'
        nextClassName='page-item'
        nextLinkClassName='page-link'
        breakLabel='...'
        breakClassName='page-item'
        breakLinkClassName='page-link'
        containerClassName='pagination'
        activeClassName='active'
        renderOnZeroPageCount={null}
      />
    </div>
  );
};

export default Pagination;
