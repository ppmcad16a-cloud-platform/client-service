import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import Checkbox from 'app/components/Common/Checkbox';

it('renders a string label with the default-icon class and reflects the checked prop', () => {
  render(<Checkbox id='cb1' name='agree' label='I agree' checked={false} onChange={() => {}} />);

  const checkbox = screen.getByRole('checkbox');
  expect(checkbox).not.toBeChecked();
  expect(checkbox.closest('.checkbox')).toHaveClass('default-icon');
  expect(screen.getByText('I agree')).toBeInTheDocument();
});

it('renders a non-string label (e.g. an icon element) with the custom-icon class', () => {
  render(
    <Checkbox id='cb2' name='agree' label={<span>Custom</span>} checked={false} onChange={() => {}} />
  );

  expect(screen.getByRole('checkbox').closest('.checkbox')).toHaveClass('custom-icon');
});

it('toggles its own local checked state immediately and reports the change upward', () => {
  const handleChange = vi.fn();
  render(<Checkbox id='cb3' name='agree' label='I agree' checked={false} onChange={handleChange} />);

  const checkbox = screen.getByRole('checkbox');
  fireEvent.click(checkbox);

  expect(checkbox).toBeChecked();
  expect(handleChange).toHaveBeenCalledWith('agree', true);
});

it('forces the checkbox unchecked while disabled regardless of local state', () => {
  render(<Checkbox id='cb4' name='agree' label='I agree' checked={true} disabled onChange={() => {}} />);

  expect(screen.getByRole('checkbox')).not.toBeChecked();
});

it('re-syncs local state when the checked prop changes from outside', () => {
  const { rerender } = render(
    <Checkbox id='cb5' name='agree' label='I agree' checked={false} onChange={() => {}} />
  );

  expect(screen.getByRole('checkbox')).not.toBeChecked();

  rerender(<Checkbox id='cb5' name='agree' label='I agree' checked={true} onChange={() => {}} />);

  expect(screen.getByRole('checkbox')).toBeChecked();
});
