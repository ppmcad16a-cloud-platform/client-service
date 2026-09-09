/**
 *
 * Carousel
 *
 */

import React from 'react';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

// Thin wrapper around react-multi-carousel with this app's default
// transition/class names baked in, so callers only need to pass
// behavioral props (autoPlay, responsive breakpoints, etc.) — see utils.js
// for a common `responsive` config.
const CarouselSlider = props => {
  const {
    swipeable,
    draggable,
    showDots,
    infinite,
    autoPlay,
    keyBoardControl,
    autoPlaySpeed,
    ssr,
    responsive,
    children
  } = props;

  return (
    <Carousel
      swipeable={swipeable}
      draggable={draggable}
      showDots={showDots}
      infinite={infinite}
      autoPlay={autoPlay}
      keyBoardControl={keyBoardControl}
      autoPlaySpeed={autoPlaySpeed}
      ssr={ssr}
      responsive={responsive}
      customTransition='all 1s'
      transitionDuration={500}
      containerClass='carousel-container'
      dotListClass='carousel-dot-list-style'
      itemClass='carousel-slider-item'
    >
      {children}
    </Carousel>
  );
};

CarouselSlider.defaultProps = {
  swipeable: false,
  draggable: false,
  showDots: false,
  infinite: true,
  autoPlay: false,
  keyBoardControl: true,
  ssr: false,
  autoPlaySpeed: 2000
};

export default CarouselSlider;
