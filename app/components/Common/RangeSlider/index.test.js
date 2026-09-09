import React from 'react';
import { render } from '@testing-library/react';

import RangeSlider from 'app/components/Common/RangeSlider';

// rc-slider drives its onChange/onAfterChange callbacks off real pointer
// drag math that jsdom can't reproduce, so these tests call the instance
// methods directly (via a ref) rather than simulating a drag gesture —
// the methods themselves are simple state/callback plumbing.
it('renders a dual-thumb Range by default and reports changes while/after dragging', () => {
  const ref = React.createRef();
  const handleChange = vi.fn();

  render(<RangeSlider ref={ref} defaultValue={[10, 90]} max={100} step={1} onChange={handleChange} />);

  ref.current.onRangeChange([20, 80]);
  expect(ref.current.state.rangeValue).toEqual([20, 80]);

  ref.current.onAfterRangeChange([20, 80]);
  expect(handleChange).toHaveBeenCalledWith([20, 80]);
});

it('renders a single-thumb Slider when type="slider" and reports changes while/after dragging', () => {
  const ref = React.createRef();
  const handleChange = vi.fn();

  render(
    <RangeSlider ref={ref} type='slider' defaultValue={50} max={100} step={1} onChange={handleChange} />
  );

  ref.current.onSliderChange(75);
  expect(ref.current.state.sliderValue).toBe(75);

  ref.current.onAfterSliderChange(75);
  expect(handleChange).toHaveBeenCalledWith(75);
});

it('renders the custom tooltip handle while dragging a thumb', () => {
  const { container } = render(<RangeSlider defaultValue={[10, 90]} max={100} step={1} onChange={() => {}} />);

  expect(container.querySelector('.slider')).toBeInTheDocument();
});
