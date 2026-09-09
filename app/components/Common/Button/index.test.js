import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import Button from 'app/components/Common/Button';

it('renders text, applies the icon-direction class, and fires onClick', () => {
  const handleClick = vi.fn();

  render(<Button text='Save' onClick={handleClick} />);

  const button = screen.getByRole('button', { name: 'Save' });
  expect(button).toBeInTheDocument();
  expect(button).toHaveClass('icon-left');

  fireEvent.click(button);
  expect(handleClick).toHaveBeenCalledTimes(1);
});

it('renders icon+text with the icon on the left by default, and icon-only with no text', () => {
  const { rerender } = render(<Button icon={<span>ICON</span>} text='Save' />);

  let button = screen.getByRole('button');
  expect(button).toHaveClass('with-icon', 'icon-left');
  expect(button.querySelector('.btn-icon')).toBeInTheDocument();
  expect(screen.getByText('Save')).toBeInTheDocument();

  rerender(<Button icon={<span>ICON</span>} />);
  button = screen.getByRole('button');
  expect(button).toHaveClass('icon-only');
});

it('renders icon+text with the icon on the right when iconDirection="right"', () => {
  render(<Button icon={<span>ICON</span>} text='Save' iconDirection='right' iconClassName='extra-icon' />);

  const button = screen.getByRole('button');
  expect(button).toHaveClass('icon-right');
  expect(button.querySelector('.btn-icon')).toHaveClass('extra-icon');
});

it('renders as text-only when neither icon nor text is given', () => {
  render(<Button ariaLabel='empty button' />);

  expect(screen.getByRole('button')).toHaveClass('text-only');
});

it('attaches a Tooltip (and gives the button a tooltip-prefixed id) when tooltip is set', () => {
  render(<Button id='btn1' text='Save' tooltip tooltipContent='Saves the form' />);

  const button = screen.getByRole('button');
  expect(button).toHaveAttribute('id', 'tooltip-btn1');
});

it('attaches a Popover (and gives the button a popover-prefixed id) when popover is set', () => {
  render(<Button id='btn2' text='Save' popover popoverContent='More info' popoverTitle='Info' />);

  const button = screen.getByRole('button');
  expect(button).toHaveAttribute('id', 'popover-btn2');
});

it('crashes when both tooltip and popover are set on the same button (existing bug: the button keeps the tooltip id, but Popover still looks for the now-nonexistent popover id)', () => {
  expect(() =>
    render(<Button id='btn3' text='Save' tooltip tooltipContent='Tip' popover popoverContent='Pop' />)
  ).toThrow(/could not be identified in the dom/);
});

it('applies a variant class and a custom border radius', () => {
  render(<Button text='Delete' variant='danger' round={10} />);

  const button = screen.getByRole('button');
  expect(button).toHaveClass('custom-btn-danger');
  expect(button).toHaveStyle({ borderRadius: 10 });
});

it('renders with no variant class when variant is "empty"', () => {
  render(<Button text='Plain' variant='empty' />);

  const button = screen.getByRole('button');
  expect(button.className).not.toMatch(/custom-btn-/);
});

it('renders with no variant class when variant is falsy', () => {
  render(<Button text='Plain' variant={null} />);

  expect(screen.getByRole('button').className).not.toMatch(/custom-btn-/);
});

it('applies a custom className and disables the button', () => {
  render(<Button text='Save' className='extra' disabled />);

  const button = screen.getByRole('button');
  expect(button).toHaveClass('extra');
  expect(button).toBeDisabled();
});

it('supports a borderless style', () => {
  render(<Button text='Save' borderless />);

  expect(screen.getByRole('button')).toHaveClass('border-0');
});
