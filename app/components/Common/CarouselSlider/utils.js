// A `responsive` config for CarouselSlider that always shows exactly one
// slide at a time regardless of breakpoint (desktop/tablet/mobile) — used by
// carousels like hero banners where slides shouldn't be shown side-by-side.
export const responsiveOneItemCarousel = {
  desktop: {
    breakpoint: {
      max: 3000,
      min: 1024
    },
    items: 1,
    slidesToSlide: 1,
    partialVisibilityGutter: 0
  },
  mobile: {
    breakpoint: {
      max: 464,
      min: 0
    },
    items: 1,
    slidesToSlide: 1,
    partialVisibilityGutter: 0
  },
  tablet: {
    breakpoint: {
      max: 1024,
      min: 200
    },
    items: 1,
    slidesToSlide: 1,
    partialVisibilityGutter: 0
  }
};
