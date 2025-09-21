import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ButtonsBar } from './ButtonsBar'; // Adjust import path as needed

describe('<ButtonsBar />', () => {
  it('renders buttons with correct labels', () => {
    const buttons = [
      { label: 'Button 1', onClick: () => {} },
      { label: 'Button 2', onClick: () => {} },
      { label: 'Button 3', onClick: () => {} },
    ];

    render(<ButtonsBar buttons={buttons} />);

    expect(screen.getByText('Button 1')).toBeInTheDocument();
    expect(screen.getByText('Button 2')).toBeInTheDocument();
    expect(screen.getByText('Button 3')).toBeInTheDocument();
  });

  it('calls onClick handler when button is clicked', () => {
    const onClick1 = vi.fn();
    const onClick2 = vi.fn();
    const buttons = [
      { label: 'Button 1', onClick: onClick1 },
      { label: 'Button 2', onClick: onClick2 },
    ];

    render(<ButtonsBar buttons={buttons} />);

    fireEvent.click(screen.getByText('Button 1'));
    expect(onClick1).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('Button 2'));
    expect(onClick2).toHaveBeenCalledTimes(1);
  });

  it('applies primary variant by default', () => {
    const buttons = [{ label: 'Primary Button', onClick: () => {} }];

    render(<ButtonsBar buttons={buttons} />);

    const button = screen.getByText('Primary Button');
    expect(button).toHaveClass('bg-blue-600');
    expect(button).toHaveClass('text-white');
    expect(button).toHaveClass('hover:bg-blue-700');
  });

  it('applies secondary variant correctly', () => {
    const buttons = [
      { label: 'Secondary Button', onClick: () => {}, variant: 'secondary' as const },
    ];

    render(<ButtonsBar buttons={buttons} />);

    const button = screen.getByText('Secondary Button');
    expect(button).toHaveClass('bg-gray-300');
    expect(button).toHaveClass('text-gray-800');
    expect(button).toHaveClass('hover:bg-gray-400');
  });

  it('applies success variant correctly', () => {
    const buttons = [{ label: 'Success Button', onClick: () => {}, variant: 'success' as const }];

    render(<ButtonsBar buttons={buttons} />);

    const button = screen.getByText('Success Button');
    expect(button).toHaveClass('bg-green-500');
    expect(button).toHaveClass('text-white');
    expect(button).toHaveClass('hover:bg-green-600');
  });

  it('applies group variant correctly', () => {
    const buttons = [{ label: 'Group Button', onClick: () => {}, variant: 'group' as const }];

    render(<ButtonsBar buttons={buttons} />);

    const button = screen.getByText('Group Button');
    expect(button).toHaveClass('my-2');
    expect(button).toHaveClass('dark:bg-slate-800');
    expect(button).toHaveClass('bg-slate-100');
    expect(button).toHaveClass('hover:bg-indigo-200');
    expect(button).toHaveClass('border');
    expect(button).toHaveClass('border-indigo-200');
    expect(button).toHaveClass('text-indigo-600');
    expect(button).toHaveClass('focus:ring-2');
    expect(button).toHaveClass('focus:ring-indigo-500');
    expect(button).toHaveClass('cursor-pointer');
  });

  it('applies base styles to all buttons', () => {
    const buttons = [
      { label: 'Button 1', onClick: () => {} },
      { label: 'Button 2', onClick: () => {}, variant: 'secondary' as const },
      { label: 'Button 3', onClick: () => {}, variant: 'success' as const },
    ];

    render(<ButtonsBar buttons={buttons} />);

    const button1 = screen.getByText('Button 1');
    const button2 = screen.getByText('Button 2');
    const button3 = screen.getByText('Button 3');

    expect(button1).toHaveClass('px-4');
    expect(button1).toHaveClass('py-2');
    expect(button1).toHaveClass('font-medium');
    expect(button1).toHaveClass('transition');
    expect(button1).toHaveClass('focus:outline-none');
    expect(button1).toHaveClass('w-full');
    expect(button1).toHaveClass('rounded-md');

    expect(button2).toHaveClass('px-4');
    expect(button3).toHaveClass('px-4');
  });

  it('renders children correctly', () => {
    const buttons = [{ label: 'Button 1', onClick: () => {} }];

    render(
      <ButtonsBar buttons={buttons}>
        <div data-testid="custom-child">Custom content</div>
      </ButtonsBar>,
    );

    expect(screen.getByTestId('custom-child')).toBeInTheDocument();
    expect(screen.getByText('Custom content')).toBeInTheDocument();
  });

  it('handles empty buttons array', () => {
    render(<ButtonsBar buttons={[]} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('handles ReactNode labels', () => {
    const buttons = [
      {
        label: <span data-testid="custom-label">Custom Label</span>,
        onClick: () => {},
      },
    ];

    render(<ButtonsBar buttons={buttons} />);

    expect(screen.getByTestId('custom-label')).toBeInTheDocument();
    expect(screen.getByText('Custom Label')).toBeInTheDocument();
  });

  it('assigns unique keys to buttons', () => {
    const buttons = [
      { label: 'Button 1', onClick: () => {} },
      { label: 'Button 2', onClick: () => {} },
      { label: 'Button 3', onClick: () => {} },
    ];

    const { container } = render(<ButtonsBar buttons={buttons} />);

    const buttonElements = container.querySelectorAll('button');
    expect(buttonElements).toHaveLength(3);

    buttonElements.forEach((button, index) => {
      expect(button.textContent).toBe(`Button ${index + 1}`);
    });
  });
});
