import React from 'react';
import { render, screen } from '@testing-library/react';

import SocketContext from './context';
import useSocket from './useSocket';

const Consumer = () => {
  const value = useSocket();
  return <span data-testid='value'>{JSON.stringify(value) ?? 'undefined'}</span>;
};

it('reads whatever value is provided by the nearest SocketContext.Provider', () => {
  const contextValue = { socket: null, connect: () => {}, disconnect: () => {} };

  render(
    <SocketContext.Provider value={contextValue}>
      <Consumer />
    </SocketContext.Provider>
  );

  expect(screen.getByTestId('value')).toHaveTextContent(
    JSON.stringify({ socket: null })
  );
});

it('is undefined when there is no provider above it', () => {
  render(<Consumer />);
  expect(screen.getByTestId('value')).toHaveTextContent('undefined');
});
