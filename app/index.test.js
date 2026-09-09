import { screen } from '@testing-library/react';

vi.mock('./app', () => ({ default: () => <div>App</div> }));

it('renders App into the #root element', async () => {
  const root = document.createElement('div');
  root.id = 'root';
  document.body.appendChild(root);

  await import('./index');

  expect(screen.getByText('App')).toBeInTheDocument();

  document.body.removeChild(root);
});
