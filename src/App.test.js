import { render, screen } from '@testing-library/react';
import App from './App';

test('renders feedback response heading', () => {
  render(<App />);
  const heading = screen.getByText(/feedback responses/i);
  expect(heading).toBeInTheDocument();
});
