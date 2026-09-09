import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import Switch from 'app/components/Common/Switch';

it('renders unchecked with a label and no tooltip by default', () => {
  render(<Switch id='sw1' label='Active' checked={false} toggleCheckboxChange={() => {}} />);

  const checkbox = screen.getByRole('checkbox');
  expect(checkbox).not.toBeChecked();
  expect(screen.getByText('Active')).toBeInTheDocument();
});

it('applies a custom inline style to the wrapper', () => {
  render(
    <Switch id='sw1b' label='Active' checked={false} style={{ marginTop: 10 }} toggleCheckboxChange={() => {}} />
  );

  expect(document.getElementById('tooltip-sw1b')).toHaveStyle({ marginTop: '10px' });
});

it('renders a tooltip when tooltip/tooltipContent are given', () => {
  render(
    <Switch
      id='sw2'
      label='Active'
      checked={false}
      tooltip
      tooltipContent='Toggle this'
      toggleCheckboxChange={() => {}}
    />
  );

  expect(document.getElementById('tooltip-sw2')).toBeInTheDocument();
});

it('toggles its own local state and reports the new value upward', () => {
  const handleChange = vi.fn();
  render(<Switch id='sw3' label='Active' checked={false} toggleCheckboxChange={handleChange} />);

  const checkbox = screen.getByRole('checkbox');
  fireEvent.click(checkbox);

  expect(checkbox).toBeChecked();
  expect(handleChange).toHaveBeenCalledWith(true);
});

it('does not throw when toggleCheckboxChange is not provided', () => {
  render(<Switch id='sw4' checked={false} />);

  expect(() => fireEvent.click(screen.getByRole('checkbox'))).not.toThrow();
});

it('re-syncs local state when the checked prop changes from outside', () => {
  const { rerender } = render(<Switch id='sw5' checked={false} toggleCheckboxChange={() => {}} />);

  expect(screen.getByRole('checkbox')).not.toBeChecked();

  rerender(<Switch id='sw5' checked={true} toggleCheckboxChange={() => {}} />);

  expect(screen.getByRole('checkbox')).toBeChecked();
});
