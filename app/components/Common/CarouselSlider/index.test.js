import React from 'react';
import { render } from '@testing-library/react';

import CarouselSlider from 'app/components/Common/CarouselSlider';
import { responsiveOneItemCarousel } from 'app/components/Common/CarouselSlider/utils';

// react-multi-carousel measures its container to decide how many/which
// slides to actually render, which jsdom can't do — so these tests assert
// on the wrapper markup CarouselSlider itself controls, not on whether a
// given slide made it into the (width-dependent) visible track.
it('renders react-multi-carousel with the default props and this app\'s class names', () => {
  const { container } = render(
    <CarouselSlider responsive={responsiveOneItemCarousel}>
      <div>Slide 1</div>
      <div>Slide 2</div>
    </CarouselSlider>
  );

  expect(container.querySelector('.carousel-container')).toBeInTheDocument();
});

it('accepts overrides for every default prop, including ssr rendering', () => {
  const { container } = render(
    <CarouselSlider
      swipeable
      draggable
      showDots
      infinite={false}
      autoPlay
      keyBoardControl={false}
      autoPlaySpeed={5000}
      ssr
      responsive={responsiveOneItemCarousel}
    >
      <div>Only slide</div>
    </CarouselSlider>
  );

  expect(container.querySelector('.carousel-container')).toBeInTheDocument();
});
