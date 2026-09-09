import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import ProductFilter from 'app/components/Store/ProductFilter';

// rc-slider's drag gestures can't be simulated in jsdom (see Common/
// RangeSlider's own tests), but its handles fully support keyboard
// interaction, which is what drives these assertions. The rating slider
// renders with `reverse` set, so ArrowLeft increases its value and
// ArrowRight decreases it — the opposite of the unreversed price slider.
it('reports a price range change when a price handle is moved', () => {
  const handleFilter = vi.fn();
  render(<ProductFilter filterProducts={handleFilter} />);

  const sliders = screen.getAllByRole('slider');
  fireEvent.keyDown(sliders[1], { key: 'ArrowLeft', keyCode: 37 });

  expect(handleFilter).toHaveBeenCalledWith('price', expect.any(Array));
});

it('maps the rating slider at its Home position (0) to 5 stars — the switch\'s default case', () => {
  const handleFilter = vi.fn();
  render(<ProductFilter filterProducts={handleFilter} />);

  const sliders = screen.getAllByRole('slider');
  fireEvent.keyDown(sliders[2], { key: 'Home', keyCode: 36 });

  expect(handleFilter).toHaveBeenCalledWith('rating', 5);
});

it('maps the rating slider at its End position (100) to 0 stars ("Any")', () => {
  const handleFilter = vi.fn();
  render(<ProductFilter filterProducts={handleFilter} />);

  const sliders = screen.getAllByRole('slider');
  fireEvent.keyDown(sliders[2], { key: 'End', keyCode: 35 });

  expect(handleFilter).toHaveBeenCalledWith('rating', 0);
});

it('maps every intermediate rating-slider mark (20/40/60/80) to its star count (4/3/2/1)', () => {
  const handleFilter = vi.fn();
  render(<ProductFilter filterProducts={handleFilter} />);

  let sliders = screen.getAllByRole('slider');
  fireEvent.keyDown(sliders[2], { key: 'Home', keyCode: 36 });

  const expectedStars = [4, 3, 2, 1, 0];
  expectedStars.forEach(stars => {
    sliders = screen.getAllByRole('slider');
    fireEvent.keyDown(sliders[2], { key: 'ArrowLeft', keyCode: 37 });
    expect(handleFilter).toHaveBeenLastCalledWith('rating', stars);
  });
});
