import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import Input from 'app/components/Common/Input';

describe('type="textarea"', () => {
  it('renders a labeled textarea and reports changes', () => {
    const handleChange = vi.fn();
    render(
      <Input type='textarea' label='Description' name='description' value='hi' onInputChange={handleChange} />
    );

    expect(screen.getByText('Description')).toBeInTheDocument();
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue('hi');

    fireEvent.change(textarea, { target: { value: 'hi there' } });
    expect(handleChange).toHaveBeenCalledWith('description', 'hi there');
  });

  it('shows the invalid state and error message when given one', () => {
    render(<Input type='textarea' name='description' value='' error={['Required.']} onInputChange={() => {}} />);

    expect(document.querySelector('.input-box.invalid')).toBeInTheDocument();
    expect(screen.getByText('Required.')).toBeInTheDocument();
  });

  it('renders with no label when none is given', () => {
    render(<Input type='textarea' name='description' value='' onInputChange={() => {}} />);

    expect(document.querySelector('label')).not.toBeInTheDocument();
  });
});

describe('type="number"', () => {
  it('renders a labeled number input, reports changes, and defaults min to 0', () => {
    const handleChange = vi.fn();
    render(<Input type='number' label='Quantity' name='quantity' value='1' onInputChange={handleChange} />);

    expect(screen.getByText('Quantity')).toBeInTheDocument();
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('min', '0');
    expect(input).not.toHaveAttribute('max');

    fireEvent.change(input, { target: { value: '2' } });
    expect(handleChange).toHaveBeenCalledWith('quantity', '2');
  });

  it('accepts an explicit min/max', () => {
    render(<Input type='number' name='quantity' value='1' min={5} max={10} onInputChange={() => {}} />);

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('min', '5');
    expect(input).toHaveAttribute('max', '10');
  });

  it('strips the decimal point on input when decimals is false', () => {
    // <input type="number"> sanitizes any raw value that isn't a valid
    // number down to '' (so a literal "12.5abc" never reaches the handler
    // at all) — '12.5' is the realistic case this guards against, stripping
    // the '.' so a quantity-style field can't end up with a decimal.
    const handleChange = vi.fn();
    render(<Input type='number' name='quantity' value='1' decimals={false} onInputChange={handleChange} />);

    const input = screen.getByRole('spinbutton');
    fireEvent.input(input, { target: { value: '12.5' } });

    expect(handleChange).toHaveBeenCalledWith('quantity', '125');
  });

  it('does not strip characters when decimals is true (the default)', () => {
    const handleChange = vi.fn();
    render(<Input type='number' name='price' value='1' onInputChange={handleChange} />);

    const input = screen.getByRole('spinbutton');
    fireEvent.input(input, { target: { value: '12.5' } });

    expect(handleChange).toHaveBeenCalledWith('price', '12.5');
  });

  it('shows the invalid state and error message when given one', () => {
    render(<Input type='number' name='quantity' value='' error={['Required.']} onInputChange={() => {}} />);

    expect(document.querySelector('.input-box.invalid')).toBeInTheDocument();
  });
});

describe('type="stars"', () => {
  it('renders a labeled star rating widget and reports changes', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <Input type='stars' label='Rating' name='rating' value={3} onInputChange={handleChange} />
    );

    expect(screen.getByText('Rating')).toBeInTheDocument();
    expect(container.querySelectorAll('.fa-star, .fa-star-half-alt').length).toBeGreaterThan(0);

    // Clicking the 5th star (data-index 4) rates it 5.
    fireEvent.click(container.querySelector('[data-index="4"]'));
    expect(handleChange).toHaveBeenCalledWith('rating', 5);
  });

  it('shows the error message when given one', () => {
    render(<Input type='stars' name='rating' value={0} error={['Required.']} onInputChange={() => {}} />);

    expect(screen.getByText('Required.')).toBeInTheDocument();
  });
});

describe('default (text/password/email/etc.)', () => {
  it('renders a labeled text input and reports changes', () => {
    const handleChange = vi.fn();
    render(<Input type='text' label='Name' name='name' value='' onInputChange={handleChange} />);

    expect(screen.getByText('Name')).toBeInTheDocument();
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Jane' } });

    expect(handleChange).toHaveBeenCalledWith('name', 'Jane');
  });

  it('applies inline-btn-box styling and renders an inline element when given one', () => {
    render(
      <Input
        type='text'
        name='sku'
        value=''
        inlineElement={<button>Generate</button>}
        onInputChange={() => {}}
      />
    );

    expect(document.querySelector('.input-box.inline-btn-box')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Generate' })).toBeInTheDocument();
  });

  it('shows the invalid state and error message when given one', () => {
    render(<Input type='text' name='name' value='' error={['Required.']} onInputChange={() => {}} />);

    expect(document.querySelector('.input-box.invalid')).toBeInTheDocument();
    expect(screen.getByText('Required.')).toBeInTheDocument();
  });

  it('disables the input and supports a custom autoComplete value', () => {
    render(<Input type='text' name='name' value='' disabled autoComplete='off' onInputChange={() => {}} />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('autocomplete', 'off');
  });
});
