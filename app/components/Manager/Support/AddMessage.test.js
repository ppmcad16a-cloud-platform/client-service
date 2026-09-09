import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import AddMessage from 'app/components/Manager/Support/AddMessage';

it('submits the typed message and clears the input', () => {
  const handleSubmit = vi.fn();
  render(<AddMessage onSubmit={handleSubmit} />);

  const input = screen.getByPlaceholderText('type message');
  fireEvent.change(input, { target: { value: 'Hello there' } });
  fireEvent.submit(input.closest('form'));

  expect(handleSubmit).toHaveBeenCalledWith('Hello there');
  expect(input).toHaveValue('');
});

it('alerts instead of submitting when the message is empty/whitespace-only', () => {
  const handleSubmit = vi.fn();
  const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
  render(<AddMessage onSubmit={handleSubmit} />);

  const input = screen.getByPlaceholderText('type message');
  fireEvent.change(input, { target: { value: '   ' } });
  fireEvent.submit(input.closest('form'));

  expect(alertSpy).toHaveBeenCalledWith('Please type message.');
  expect(handleSubmit).not.toHaveBeenCalled();

  alertSpy.mockRestore();
});

it('disables the Send button until there is a message typed', () => {
  render(<AddMessage onSubmit={() => {}} />);

  const button = screen.getByRole('button', { name: 'Send' });
  expect(button).toBeDisabled();

  fireEvent.change(screen.getByPlaceholderText('type message'), { target: { value: 'Hi' } });
  expect(button).toBeEnabled();
});
