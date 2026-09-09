/**
 *
 * SocialShare
 *
 */

import React from 'react';

import {
  EmailShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookShareButton
} from 'react-share';

// Share buttons on a product page. NOTE: `shareMsg` is passed as each
// button's `url` prop, but it's actually the full share message with the
// URL embedded in it, not a bare URL — works for these share targets in
// practice, just not what the prop name implies. Also,
// `window.location.protocol` is always e.g. "https:" (with a trailing
// colon), so `!== 'https'` (no colon) is always true — the ternary below
// always resolves to 'http', regardless of whether the page is actually
// served over HTTPS.
const SocialShare = props => {
  const { product } = props;

  const shareMsg = `I ♥ ${
    product.name
  } product on Mern Store!  Here's the link, ${
    window.location.protocol !== 'https' ? 'http' : 'https'
  }://${window.location.host}/product/${product.slug}`;

  return (
    <ul className='d-flex flex-row mx-0 mb-0 justify-content-center justify-content-md-start share-box'>
      <li>
        <FacebookShareButton url={`${shareMsg}`} className='share-btn facebook'>
          <i className='fa fa-facebook'></i>
        </FacebookShareButton>
      </li>
      <li>
        <TwitterShareButton url={`${shareMsg}`} className='share-btn twitter'>
          <i className='fa fa-twitter'></i>
        </TwitterShareButton>
      </li>
      <li>
        <EmailShareButton url={`${shareMsg}`} className='share-btn envelope'>
          <i className='fa fa-envelope-o'></i>
        </EmailShareButton>
      </li>
      <li>
        <WhatsappShareButton url={`${shareMsg}`} className='share-btn whatsapp'>
          <i className='fa fa-whatsapp'></i>
        </WhatsappShareButton>
      </li>
    </ul>
  );
};

export default SocialShare;
