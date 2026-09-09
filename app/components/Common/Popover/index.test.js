import React from 'react';
import { render } from '@testing-library/react';

import Popover from 'app/components/Common/Popover';

it('renders without a header when no popoverTitle is given', () => {
  render(
    <>
      <button id='btn1' />
      <Popover target='btn1'>Body content</Popover>
    </>
  );
});

it('renders a header when popoverTitle is given', () => {
  render(
    <>
      <button id='btn2' />
      <Popover target='btn2' popoverTitle='Confirm' placement='bottom'>
        Body content
      </Popover>
    </>
  );
});
