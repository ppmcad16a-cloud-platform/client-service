import React from 'react';
import { render, screen } from '@testing-library/react';

import Table from 'app/components/Common/Table';

const columns = [
  { dataField: '_id', text: 'ID' },
  { dataField: 'name', text: 'Name' }
];

const data = [
  { _id: '1', name: 'Widget' },
  { _id: '2', name: 'Gadget' }
];

it('renders the table with the given data and columns', () => {
  render(<Table data={data} columns={columns} clickAction={() => {}} />);

  expect(screen.getByText('Widget')).toBeInTheDocument();
  expect(screen.getByText('Gadget')).toBeInTheDocument();
});

it('shows the built-in no-data message when data is empty', () => {
  render(<Table data={[]} columns={columns} clickAction={() => {}} />);

  expect(screen.getByText('Oops! No data now! Please try again!')).toBeInTheDocument();
});

it('renders a CSV export button when csv is set', () => {
  render(<Table data={data} columns={columns} csv clickAction={() => {}} />);

  expect(screen.getByText('Export CSV')).toBeInTheDocument();
});

it('renders a built-in search box when search is set', () => {
  const { container } = render(<Table data={data} columns={columns} search clickAction={() => {}} />);

  expect(container.querySelector('.search input')).toBeInTheDocument();
});

it('applies striped/hover/condensed table styling', () => {
  const { container } = render(
    <Table data={data} columns={columns} striped hover condensed clickAction={() => {}} />
  );

  const table = container.querySelector('table');
  expect(table).toHaveClass('table-striped', 'table-hover', 'table-condensed');
});
