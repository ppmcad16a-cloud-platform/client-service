import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import SearchBar from 'app/components/Common/SearchBar';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

it('renders with its default props', () => {
  render(<SearchBar />);

  expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
});

it('debounces onSearch to fire 1s after the user stops typing', () => {
  const handleSearch = vi.fn();
  render(<SearchBar name='q' onSearch={handleSearch} />);

  const input = screen.getByPlaceholderText('Search');
  fireEvent.change(input, { target: { name: 'q', value: 'a' } });
  fireEvent.change(input, { target: { name: 'q', value: 'ab' } });

  expect(handleSearch).not.toHaveBeenCalled();

  vi.advanceTimersByTime(1000);

  expect(handleSearch).toHaveBeenCalledTimes(1);
  expect(handleSearch).toHaveBeenCalledWith({ name: 'q', value: 'ab' });
});

it('does not throw when onSearch is not provided once the debounce timer fires', () => {
  render(<SearchBar name='q' />);

  fireEvent.change(screen.getByPlaceholderText('Search'), { target: { name: 'q', value: 'a' } });

  expect(() => vi.advanceTimersByTime(1000)).not.toThrow();
});

it('calls onSearchSubmit with the current value on form submit', () => {
  const handleSubmit = vi.fn();
  render(<SearchBar name='q' onSearchSubmit={handleSubmit} />);

  const input = screen.getByPlaceholderText('Search');
  fireEvent.change(input, { target: { name: 'q', value: 'widget' } });
  fireEvent.click(screen.getByRole('button', { name: 'Search' }));

  expect(handleSubmit).toHaveBeenCalledWith({ name: 'q', value: 'widget' });
});

it('does not throw when onSearchSubmit is not provided', () => {
  render(<SearchBar name='q' />);

  expect(() => fireEvent.click(screen.getByRole('button', { name: 'Search' }))).not.toThrow();
});

it('calls onBlur with the current field value', () => {
  const handleBlur = vi.fn();
  render(<SearchBar name='q' onBlur={handleBlur} />);

  const input = screen.getByPlaceholderText('Search');
  fireEvent.blur(input, { target: { name: 'q', value: 'x' } });

  expect(handleBlur).toHaveBeenCalledWith({ name: 'q', value: 'x' });
});

it('does not throw when onBlur is not provided', () => {
  render(<SearchBar name='q' />);

  expect(() => fireEvent.blur(screen.getByPlaceholderText('Search'))).not.toThrow();
});

it('wires up onKeyPress when provided, and defaults to null otherwise', () => {
  const handleKeyPress = vi.fn();
  const { rerender } = render(<SearchBar onKeyPress={handleKeyPress} />);

  fireEvent.keyPress(screen.getByPlaceholderText('Search'), { key: 'Enter', code: 13, charCode: 13 });
  expect(handleKeyPress).toHaveBeenCalled();

  rerender(<SearchBar />);
  expect(() =>
    fireEvent.keyPress(screen.getByPlaceholderText('Search'), { key: 'Enter', code: 13, charCode: 13 })
  ).not.toThrow();
});

it('applies inline-btn-box styling and a custom className', () => {
  render(<SearchBar inlineBtn className='extra' />);

  expect(document.querySelector('.search-box.inline-btn-box')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Search')).toHaveClass('extra');
});

it('omits inline-btn-box styling when inlineBtn is false', () => {
  render(<SearchBar inlineBtn={false} />);

  expect(document.querySelector('.search-box.inline-btn-box')).not.toBeInTheDocument();
  expect(document.querySelector('.search-box')).toBeInTheDocument();
});

it('clears a pending debounce timer when the user types again quickly', () => {
  const handleSearch = vi.fn();
  render(<SearchBar name='q' onSearch={handleSearch} />);

  const input = screen.getByPlaceholderText('Search');
  fireEvent.change(input, { target: { name: 'q', value: 'a' } });
  vi.advanceTimersByTime(500);
  fireEvent.change(input, { target: { name: 'q', value: 'ab' } });
  vi.advanceTimersByTime(500);

  expect(handleSearch).not.toHaveBeenCalled();

  vi.advanceTimersByTime(500);
  expect(handleSearch).toHaveBeenCalledTimes(1);
});
