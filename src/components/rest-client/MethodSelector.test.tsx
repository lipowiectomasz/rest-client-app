import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MethodSelector } from './MethodSelector';

describe('<MethodSelector />', () => {
  it('renders with initial method selected', () => {
    render(<MethodSelector initialMethod="POST" onChange={() => {}} />);

    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('POST');
  });

  it('renders all HTTP methods as options', () => {
    render(<MethodSelector initialMethod="GET" onChange={() => {}} />);

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(4);
    expect(options[0]).toHaveValue('GET');
    expect(options[1]).toHaveValue('POST');
    expect(options[2]).toHaveValue('PUT');
    expect(options[3]).toHaveValue('DELETE');
  });

  it('calls onChange when selection changes', () => {
    const onChange = vi.fn();
    render(<MethodSelector initialMethod="GET" onChange={onChange} />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'POST' } });

    expect(onChange).toHaveBeenCalledWith('POST');
  });

  it('does not call onChange when prop is not provided', () => {
    render(<MethodSelector initialMethod="GET" />);

    const select = screen.getByRole('combobox');
    expect(() => {
      fireEvent.change(select, { target: { value: 'POST' } });
    }).not.toThrow();
  });

  it('updates selected value when initialMethod prop changes', () => {
    const { rerender } = render(<MethodSelector initialMethod="GET" onChange={() => {}} />);

    expect(screen.getByRole('combobox')).toHaveValue('GET');

    rerender(<MethodSelector initialMethod="DELETE" onChange={() => {}} />);

    expect(screen.getByRole('combobox')).toHaveValue('DELETE');
  });

  it('has proper accessibility attributes', () => {
    render(<MethodSelector initialMethod="GET" onChange={() => {}} />);

    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('name', 'methods');
  });

  it('applies correct CSS classes', () => {
    render(<MethodSelector initialMethod="GET" onChange={() => {}} />);

    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('dark:bg-slate-800');
    expect(select).toHaveClass('bg-slate-100');
    expect(select).toHaveClass('shadow-sm');
    expect(select).toHaveClass('shadow-indigo-600');
    expect(select).toHaveClass('focus:ring-2');
    expect(select).toHaveClass('focus:ring-indigo-500');
  });

  it('handles all method changes correctly', () => {
    const onChange = vi.fn();
    render(<MethodSelector initialMethod="GET" onChange={onChange} />);

    const select = screen.getByRole('combobox');

    fireEvent.change(select, { target: { value: 'POST' } });
    expect(onChange).toHaveBeenCalledWith('POST');

    fireEvent.change(select, { target: { value: 'PUT' } });
    expect(onChange).toHaveBeenCalledWith('PUT');

    fireEvent.change(select, { target: { value: 'DELETE' } });
    expect(onChange).toHaveBeenCalledWith('DELETE');

    fireEvent.change(select, { target: { value: 'GET' } });
    expect(onChange).toHaveBeenCalledWith('GET');
  });
});
