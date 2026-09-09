import React from 'react';
import { render } from '@testing-library/react';

import {
  BagIcon,
  BarsIcon,
  CloseIcon,
  CheckIcon,
  RefreshIcon,
  AddressIcon,
  ReviewIcon,
  TrashIcon,
  HeartIcon,
  XIcon,
  ArrowBackIcon
} from 'app/components/Common/Icon';

it('renders BagIcon', () => {
  const { container } = render(<BagIcon />);
  expect(container.querySelector('.bag-icon')).toBeInTheDocument();
});

it('renders BarsIcon', () => {
  const { container } = render(<BarsIcon />);
  expect(container.querySelector('.bars-icon')).toBeInTheDocument();
});

it('renders CloseIcon', () => {
  const { container } = render(<CloseIcon />);
  expect(container.querySelector('.close-icon')).toBeInTheDocument();
});

it('renders CheckIcon with defaults and with custom props', () => {
  const { container, rerender } = render(<CheckIcon />);
  let svg = container.querySelector('.check-icon');
  expect(svg).toHaveAttribute('width', '24');
  expect(svg).toHaveAttribute('stroke', 'currentColor');

  rerender(<CheckIcon className='extra' color='red' width='30' height='30' />);
  svg = container.querySelector('.check-icon');
  expect(svg).toHaveClass('extra');
  expect(svg).toHaveAttribute('stroke', 'red');
});

it('renders RefreshIcon with defaults and custom props', () => {
  const { container, rerender } = render(<RefreshIcon />);
  expect(container.querySelector('.refresh-icon')).toHaveAttribute('width', '20');

  rerender(<RefreshIcon className='extra' width='40' height='40' />);
  expect(container.querySelector('.refresh-icon')).toHaveClass('extra');
});

it('renders AddressIcon with defaults and custom props', () => {
  const { container, rerender } = render(<AddressIcon />);
  expect(container.querySelector('.address-icon')).toBeInTheDocument();

  rerender(<AddressIcon className='extra' width='40' height='40' />);
  expect(container.querySelector('.address-icon')).toHaveClass('extra');
});

it('renders ReviewIcon with defaults and custom props', () => {
  const { container, rerender } = render(<ReviewIcon />);
  expect(container.querySelector('.review-icon')).toBeInTheDocument();

  rerender(<ReviewIcon className='extra' width='80' height='80' />);
  expect(container.querySelector('.review-icon')).toHaveClass('extra');
});

it('renders TrashIcon with defaults and custom props', () => {
  const { container, rerender } = render(<TrashIcon />);
  expect(container.querySelector('.trash-icon')).toBeInTheDocument();

  rerender(<TrashIcon className='extra' width='40' height='40' />);
  expect(container.querySelector('.trash-icon')).toHaveClass('extra');
});

it('renders XIcon with defaults and custom props', () => {
  const { container, rerender } = render(<XIcon />);
  expect(container.querySelector('.x-icon')).toBeInTheDocument();

  rerender(<XIcon className='extra' width='40' height='40' />);
  expect(container.querySelector('.x-icon')).toHaveClass('extra');
});

it('renders HeartIcon with defaults and custom className', () => {
  const { container, rerender } = render(<HeartIcon />);
  expect(container.querySelector('.heart-icon')).toBeInTheDocument();

  rerender(<HeartIcon className='extra' />);
  expect(container.querySelector('.heart-icon')).toHaveClass('extra');
});

it('renders ArrowBackIcon with defaults and custom props', () => {
  const { container, rerender } = render(<ArrowBackIcon />);
  expect(container.querySelector('.arrow-left-icon')).toBeInTheDocument();

  rerender(<ArrowBackIcon className='extra' width='40' height='40' />);
  expect(container.querySelector('.arrow-left-icon')).toHaveClass('extra');
});
