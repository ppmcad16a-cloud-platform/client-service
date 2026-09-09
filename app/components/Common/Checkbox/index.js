/**
 *
 * Checkbox
 *
 */

import React, { useEffect, useState } from 'react';

// Hybrid controlled/uncontrolled: mirrors the `checked` prop into local
// state (so it re-renders immediately on click without waiting on the
// parent), but stays in sync with the parent via the effect below whenever
// `checked` changes from outside.
const Checkbox = props => {
  const { className, id, name, label, disabled, checked, onChange } = props;
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const _onChange = e => {
    setIsChecked(!isChecked);

    const value = e.target.checked;
    const name = e.target.name;
    onChange(name, value);
  };

  const isLabelText = label && typeof label === 'string';
  const extraClassName = isLabelText
    ? ` default-icon ${className}`
    : ` custom-icon ${className}`;

  return (
    <div className={`checkbox${extraClassName}`}>
      <input
        className={'input-checkbox'}
        type={'checkbox'}
        id={id}
        name={name}
        checked={!disabled ? isChecked : false}
        onChange={_onChange}
      />
      <label htmlFor={id} type='submit'>
        {/* Both branches are identical — isLabelText doesn't actually
            change what's rendered here, only the className above. */}
        {isLabelText ? label : label}
      </label>
    </div>
  );
};

export default Checkbox;

Checkbox.defaultProps = {
  className: ''
};
