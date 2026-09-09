/**
 *
 * Table
 *
 */

import React from 'react';

import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, {
  CSVExport,
  Search
} from 'react-bootstrap-table2-toolkit';

// Message shown by react-bootstrap-table-next when `data` is empty.
const indication = () => {
  return 'Oops! No data now! Please try again!';
};

const { ExportCSVButton } = CSVExport;
const { SearchBar } = Search;

// Wraps react-bootstrap-table-next + its toolkit (CSV export, built-in
// search box) with this app's styling — used across every admin/merchant
// dashboard list (products, orders, users, etc.).
const Table = props => {
  const {
    data,
    columns,
    striped,
    hover,
    condensed,
    csv,
    search,
    clickAction,
    isRowEvents
  } = props;

  // Dead: built here but never actually attached to BootstrapTable below
  // (that line is commented out), so `isRowEvents`/`clickAction` currently
  // have no effect — rows aren't clickable through this component.
  /* v8 ignore start */
  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      clickAction(row._id, rowIndex);
    }
  };
  /* v8 ignore stop */

  return (
    <ToolkitProvider
      keyField='_id'
      data={data}
      columns={columns}
      exportCSV={csv}
      search={search}
    >
      {props => (
        <div className='table-section'>
          {csv && (
            <div className='csv'>
              <ExportCSVButton
                className='input-btn custom-btn-secondary md'
                {...props.csvProps}
              >
                Export CSV
              </ExportCSVButton>
            </div>
          )}
          {search && (
            <div className='search'>
              <SearchBar {...props.searchProps} />
            </div>
          )}
          <BootstrapTable
            {...props.baseProps}
            keyField='_id'
            data={data}
            columns={columns}
            striped={striped}
            hover={hover}
            condensed={condensed}
            noDataIndication={indication}
            // rowEvents={isRowEvents ? rowEvents : null}
          />
        </div>
      )}
    </ToolkitProvider>
  );
};

export default Table;
