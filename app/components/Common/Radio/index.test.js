import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import Radio from 'app/components/Common/Radio';

// Radio is unused anywhere in the app today (superseded by SelectOption-based
// sorting elsewhere) — tested directly as a standalone unit regardless.
it('renders all three sorting options, none selected initially', () => {
  render(<Radio handleChangeSubmit={() => {}} />);

  const radios = screen.getAllByRole('radio');
  expect(radios).toHaveLength(3);
  radios.forEach(radio => expect(radio).not.toBeChecked());
});

it('selects an option and reports the change upward', () => {
  const handleChangeSubmit = vi.fn();
  render(<Radio handleChangeSubmit={handleChangeSubmit} />);

  const option = screen.getByDisplayValue('Price High to Low');
  fireEvent.click(option);

  expect(option).toBeChecked();
  expect(handleChangeSubmit).toHaveBeenCalledWith('sorting', 'Price High to Low');
});
