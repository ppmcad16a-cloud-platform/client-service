/**
 *
 *  Range Slider
 *
 */

import React from 'react';
import Slider, { SliderTooltip } from 'rc-slider';

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);
const { Handle } = Slider;

// Custom handle renderer for the dual-thumb Range slider (used for the
// price filter): shows a "$<value>" tooltip above the thumb while dragging.
// NOTE: dead code — createSliderWithTooltip's own wrapper (see Range below)
// always overrides whatever `handle` prop is passed to the wrapped
// component with its own internal tooltip-handle renderer, so this function
// is never actually invoked by rc-slider regardless of the `handle` prop
// passed to <Range> below.
/* v8 ignore start */
const handle = props => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <SliderTooltip
      prefixCls='rc-slider-tooltip'
      overlay={`$${value}`}
      visible={dragging}
      placement='top'
      key={index}
    >
      <Handle value={value} {...restProps} />
    </SliderTooltip>
  );
};
/* v8 ignore stop */

// Renders either a single-thumb Slider or a dual-thumb Range, depending on
// `type` — used for e.g. a quantity slider (single) vs. a min/max price
// filter (range). Local state tracks the value while dragging;
// `onChange`/`onAfterSliderChange`/`onAfterRangeChange` only notify the
// parent once dragging finishes (onAfterChange), not on every tick.
class RangeSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sliderValue: 50,
      rangeValue: this.props.defaultValue
    };
  }

  onSliderChange = v => {
    this.setState({
      sliderValue: v
    });
  };

  onRangeChange = v => {
    this.setState({
      rangeValue: v
    });
  };

  onAfterSliderChange = value => {
    this.props.onChange(value);
  };

  onAfterRangeChange = value => {
    this.props.onChange(value);
  };

  render() {
    const { type, marks, step, defaultValue, max, allowCross } = this.props;
    const { sliderValue, rangeValue } = this.state;

    return (
      <>
        {type === 'slider' ? (
          <Slider
            className='slider'
            dots
            reverse
            allowCross={allowCross}
            step={step}
            defaultValue={defaultValue}
            marks={marks}
            value={sliderValue}
            onChange={this.onSliderChange}
            onAfterChange={this.onAfterSliderChange}
          />
        ) : (
          <Range
            className='slider'
            pushable={10}
            allowCross={allowCross}
            min={1}
            max={max}
            step={step}
            defaultValue={defaultValue}
            marks={marks}
            handle={handle}
            tipFormatter={value => `$${value}`}
            value={rangeValue}
            onChange={this.onRangeChange}
            onAfterChange={this.onAfterRangeChange}
          />
        )}
      </>
    );
  }
}

RangeSlider.defaultProps = {
  type: 'range',
  allowCross: true
};

export default RangeSlider;
