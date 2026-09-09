import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import SelectOption from 'app/components/Common/SelectOption';

const options = [
  { value: 'b1', label: 'Brand One' },
  { value: 'b2', label: 'Brand Two' },
  { value: 'b3', label: 'Brand Three', isDisabled: true }
];

it('renders a label and the current single value', () => {
  render(
    <SelectOption
      label='Brand'
      options={options}
      value={options[0]}
      handleSelectChange={() => {}}
    />
  );

  expect(screen.getByText('Brand')).toBeInTheDocument();
  expect(screen.getByText('Brand One')).toBeInTheDocument();
});

it('shows a placeholder-styled empty control when there is no value', () => {
  render(<SelectOption options={options} value={null} handleSelectChange={() => {}} />);

  expect(document.querySelector('.select-container')).toBeInTheDocument();
});

it('shows the invalid state and error message when given one', () => {
  render(<SelectOption options={options} value={null} error={['Required.']} handleSelectChange={() => {}} />);

  expect(document.querySelector('.select-box.invalid')).toBeInTheDocument();
  expect(screen.getByText('Required.')).toBeInTheDocument();
});

it('opens the menu, focuses/selects an option, and reports the chosen option upward', () => {
  const handleChange = vi.fn();
  // Selecting one option (isSelected) alongside a disabled one (isDisabled)
  // exercises every branch of dropdownStyles.option's background-color
  // ternary chain, not just the plain unselected/enabled row.
  const { container } = render(
    <SelectOption options={options} value={options[0]} handleSelectChange={handleChange} />
  );

  const control = container.querySelector('.react-select__control');
  fireEvent.mouseDown(control, { button: 0 });

  const option = screen.getByText('Brand Two');
  fireEvent.click(option);

  expect(handleChange).toHaveBeenCalledWith(options[1]);
});

it('highlights a hovered option that is neither selected nor disabled', () => {
  const { container } = render(
    <SelectOption options={options} value={options[0]} handleSelectChange={() => {}} />
  );

  fireEvent.mouseDown(container.querySelector('.react-select__control'), { button: 0 });
  fireEvent.mouseMove(screen.getByText('Brand Two'));

  expect(container.querySelector('.react-select__option--is-focused')).toBeInTheDocument();
});

it('renders as disabled when disabled is set', () => {
  const { container } = render(
    <SelectOption options={options} value={null} disabled handleSelectChange={() => {}} />
  );

  expect(container.querySelector('.react-select__control--is-disabled')).toBeInTheDocument();
});

it('supports multi-select mode with a defaultValue', () => {
  render(
    <SelectOption
      options={options}
      multi
      defaultValue={[options[0]]}
      value={[options[0]]}
      handleSelectChange={() => {}}
    />
  );

  expect(screen.getByText('Brand One')).toBeInTheDocument();
});
