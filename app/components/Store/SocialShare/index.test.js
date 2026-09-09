import React from 'react';
import { render } from '@testing-library/react';

import SocialShare from 'app/components/Store/SocialShare';

it('renders a share button for each network', () => {
  const { container } = render(<SocialShare product={{ name: 'Widget', slug: 'widget' }} />);

  expect(container.querySelector('.share-btn.facebook')).toBeInTheDocument();
  expect(container.querySelector('.share-btn.twitter')).toBeInTheDocument();
  expect(container.querySelector('.share-btn.envelope')).toBeInTheDocument();
  expect(container.querySelector('.share-btn.whatsapp')).toBeInTheDocument();
});
