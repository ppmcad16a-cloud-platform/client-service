/**
 *
 * Input
 *
 */

import React from 'react';
import ReactStars from 'react-rating-stars-component';

// One generic form-field component standing in for several native input
// types plus a star-rating widget — `type` picks which of the four branches
// below renders (textarea / number / stars / everything else, which covers
// text/password/email/etc. as a plain <input type={type}>).
const Input = props => {
  const {
    autoComplete,
    type,
    value,
    error,
    step,
    decimals,
    min,
    max,
    disabled,
    placeholder,
    rows,
    label,
    name,
    onInputChange,
    inlineElement
  } = props;

  const _onChange = e => {
    onInputChange(e.target.name, e.target.value);
  };

  if (type === 'textarea') {
    const styles = `input-box${error ? ' invalid' : ''}`;

    return (
      <div className={styles}>
        {label && <label>{label}</label>}
        <textarea
          type={'textarea'}
          onChange={e => {
            _onChange(e);
          }}
          rows={rows}
          name={name}
          value={value}
          placeholder={placeholder}
          className={'textarea-text'}
        />
        <span className='invalid-message'>{error && error[0]}</span>
      </div>
    );
  } else if (type === 'number') {
    const styles = `input-box${error ? ' invalid' : ''}`;

    // decimals: false strips anything but digits as the user types, so a
    // quantity-style number field can't have a decimal point entered at all.
    const handleOnInput = e => {
      if (!decimals) {
        e.target.value = e.target.value.replace(/[^0-9]*/g, '');
      }
    };
    return (
      <div className={styles}>
        {label && <label>{label}</label>}
        <input
          autoComplete={autoComplete}
          step='step'
          min={min || 0}
          max={max || null}
          pattern='[0-9]'
          onInput={handleOnInput}
          type={type}
          onChange={e => {
            _onChange(e);
          }}
          disabled={disabled}
          name={name}
          value={value}
          placeholder={placeholder}
          className={'input-number'}
        />
        <span className='invalid-message'>{error && error[0]}</span>
      </div>
    );
  } else if (type === 'stars') {
    const styles = `input-box${error ? ' invalid' : ''}`;

    return (
      <div className={styles}>
        {label && <label>{label}</label>}
        <ReactStars
          name={name}
          starCount={5}
          size={30}
          color={'#adb5bd'}
          activeColor={'#ffb302'}
          a11y={true}
          isHalf={false}
          emptyIcon={<i className='fa fa-star' />}
          halfIcon={<i className='fa fa-star-half-alt' />}
          filledIcon={<i className='fa fa-star' />}
          value={value}
          onChange={value => {
            onInputChange(name, value);
          }}
        />
        <span className='invalid-message'>{error && error[0]}</span>
      </div>
    );
  } else {
    const styles = `input-box${inlineElement ? ` inline-btn-box` : ''} ${
      error ? 'invalid' : ''
    }`;

    return (
      <div className={styles}>
        {label && <label>{label}</label>}
        <div className='input-text-block'>
          <input
            className={'input-text'}
            autoComplete={autoComplete}
            type={type}
            onChange={e => {
              _onChange(e);
            }}
            disabled={disabled}
            name={name}
            value={value}
            placeholder={placeholder}
          />
          {inlineElement}
        </div>
        <span className='invalid-message'>{error && error[0]}</span>
      </div>
    );
  }
};

Input.defaultProps = {
  step: 1,
  decimals: true,
  rows: '4',
  inlineElement: null,
  autoComplete: 'on'
};

export default Input;
