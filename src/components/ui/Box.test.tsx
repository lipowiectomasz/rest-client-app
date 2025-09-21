import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Box from './Box';

describe('<Box />', () => {
  it('renders children correctly', () => {
    render(
      <Box>
        <div data-testid="child">Child content</div>
      </Box>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('handles empty className prop', () => {
    render(<Box className="">Test content</Box>);

    const box = screen.getByText('Test content').parentElement;

    expect(box?.className).not.toMatch(/\s{2,}/);
    expect(box?.className).not.toContain('undefined');
  });

  it('handles undefined className prop', () => {
    render(<Box>Test content</Box>);

    const box = screen.getByText('Test content').parentElement;

    expect(box?.className).not.toContain('undefined');
    expect(box?.className).not.toContain('null');
  });

  it('renders multiple children correctly', () => {
    render(
      <Box>
        <div>First child</div>
        <div>Second child</div>
        <div>Third child</div>
      </Box>,
    );

    expect(screen.getByText('First child')).toBeInTheDocument();
    expect(screen.getByText('Second child')).toBeInTheDocument();
    expect(screen.getByText('Third child')).toBeInTheDocument();
  });

  it('renders complex children structures', () => {
    render(
      <Box>
        <header>
          <h1>Title</h1>
        </header>
        <main>
          <p>Paragraph content</p>
          <button>Click me</button>
        </main>
        <footer>
          <span>Footer content</span>
        </footer>
      </Box>,
    );

    expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument();
    expect(screen.getByText('Paragraph content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('has correct DOM structure', () => {
    const { container } = render(<Box>Test content</Box>);

    const box = container.firstChild;
    expect(box).toBeInstanceOf(HTMLDivElement);
    expect(box).toHaveTextContent('Test content');
  });
});
