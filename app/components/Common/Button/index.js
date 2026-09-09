/**
 *
 * Button
 *
 */

import React from 'react';

import Tooltip from '../Tooltip';
import Popover from '../Popover';

// The one <button> component used everywhere in the app — handles
// text-only/icon-only/icon+text layouts and can optionally attach a Tooltip
// or Popover to itself via the `tooltip`/`popover` props.
const variants = {
  primary: 'custom-btn-primary',
  secondary: 'custom-btn-secondary',
  danger: 'custom-btn-danger',
  link: 'custom-btn-link',
  dark: 'custom-btn-dark',
  none: 'custom-btn-none',
  empty: ''
};

const Button = props => {
  const {
    id,
    size,
    variant,
    tabIndex,
    ariaLabel,
    ariaExpanded,
    type,
    disabled,
    className,
    text,
    role,
    icon,
    iconDirection,
    iconClassName,
    borderless,
    round,
    onClick,
    tooltip,
    tooltipContent,
    popover,
    popoverContent,
    popoverTitle
  } = props;

  const v = variant ? variants[variant] : '';

  const btnVariant = v;

  const btn =
    icon && text ? 'with-icon' : icon && !text ? 'icon-only' : 'text-only';

  const classNames = `input-btn${`${className && ` ${className}`}`}${
    btnVariant && ` ${btnVariant}`
  }${` ${size}`} ${btn} ${
    iconDirection === 'left' ? 'icon-left' : 'icon-right'
  } ${borderless ? 'border-0' : ''}`;

  const iconClassNames = `btn-icon${`${iconClassName && ` ${iconClassName}`}`}`;

  // If both `tooltip` and `popover` are set, the button's own id ends up as
  // tooltipId (tooltip wins) even though the Popover below still renders
  // and targets popoverId — using both on the same button isn't really
  // supported.
  const tooltipId = tooltip ? `tooltip-${id}` : id;
  const popoverId = popover ? `popover-${id}` : id;
  const btnId = tooltip ? tooltipId : popoverId;

  return (
    <button
      id={btnId}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      role={role}
      disabled={disabled}
      className={classNames}
      type={type}
      onClick={onClick}
      style={{
        borderRadius: round
      }}
    >
      {tooltip && <Tooltip target={tooltipId}>{tooltipContent}</Tooltip>}
      {popover && (
        <Popover target={popoverId} popoverTitle={popoverTitle}>
          {popoverContent}
        </Popover>
      )}
      {iconDirection === 'left' ? (
        <>
          {icon && <div className={iconClassNames}>{icon}</div>}
          {text && <span className='btn-text'>{text}</span>}
        </>
      ) : (
        <>
          {text && <span className='btn-text'>{text}</span>}
          {icon && <div className={iconClassNames}>{icon}</div>}
        </>
      )}
    </button>
  );
};

Button.defaultProps = {
  type: 'button',
  variant: 'secondary',
  size: 'md',
  className: '',
  iconDirection: 'left',
  iconClassName: '',
  borderless: false,
  round: 3,
  tooltip: false,
  popover: false
};

export default Button;
