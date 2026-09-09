import React from 'react';
import { render } from '@testing-library/react';

import Tooltip from 'app/components/Common/Tooltip';

it('renders attached to its target with the default placement', () => {
  render(
    <>
      <button id='btn1' />
      <Tooltip target='btn1'>Helpful text</Tooltip>
    </>
  );
});

it('renders with a custom placement', () => {
  render(
    <>
      <button id='btn2' />
      <Tooltip target='btn2' placement='bottom'>
        Helpful text
      </Tooltip>
    </>
  );
});
