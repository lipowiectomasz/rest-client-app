import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UrlInput } from './UrlInput';

describe('<UrlInput />', () => {
  it('renders with initial value', () => {
    render(<UrlInput value="https://api.example.com" onChange={() => {}} />);

    const input = screen.getByPlaceholderText('https://api.example.com') as HTMLInputElement;
    expect(input.value).toBe('https://api.example.com');
  });

  it('renders with empty value when no initial value provided', () => {
    render(<UrlInput value="" onChange={() => {}} />);

    const input = screen.getByPlaceholderText('https://api.example.com') as HTMLInputElement;
    expect(input.value).toBe('');
  });

  it('calls onChange when input value changes', () => {
    const onChange = vi.fn();
    render(<UrlInput value="" onChange={onChange} />);

    const input = screen.getByPlaceholderText('https://api.example.com');
    fireEvent.change(input, { target: { value: 'https://new-url.com' } });

    expect(onChange).toHaveBeenCalledWith('https://new-url.com');
  });

  it('updates input value when value prop changes', () => {
    const { rerender } = render(<UrlInput value="initial" onChange={() => {}} />);

    const input = screen.getByPlaceholderText('https://api.example.com') as HTMLInputElement;
    expect(input.value).toBe('initial');

    rerender(<UrlInput value="updated" onChange={() => {}} />);

    expect(input.value).toBe('updated');
  });

  it('has correct input attributes', () => {
    render(<UrlInput value="" onChange={() => {}} />);

    const input = screen.getByPlaceholderText('https://api.example.com');
    expect(input).toHaveAttribute('id', 'url-input');
    expect(input).toHaveAttribute('name', 'url');
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('required');
  });

  it('applies correct CSS classes', () => {
    render(<UrlInput value="" onChange={() => {}} />);

    const input = screen.getByPlaceholderText('https://api.example.com');
    expect(input).toHaveClass('w-full');
    expect(input).toHaveClass('px-2');
    expect(input).toHaveClass('my-2');
    expect(input).toHaveClass('focus:outline-none');
    expect(input).toHaveClass('focus:ring-2');
    expect(input).toHaveClass('focus:ring-indigo-500');
    expect(input).toHaveClass('bg-slate-50');
    expect(input).toHaveClass('rounded-md');
    expect(input).toHaveClass('text-black');
  });

  it('handles various URL formats correctly', () => {
    const onChange = vi.fn();
    render(<UrlInput value="" onChange={onChange} />);

    const input = screen.getByPlaceholderText('https://api.example.com');

    const testUrls = [
      'https://api.example.com',
      'http://localhost:3000',
      'https://sub.domain.com/path?query=param',
      'ws://websocket.example.com',
      'ftp://ftp.example.com',
    ];

    testUrls.forEach((testUrl) => {
      fireEvent.change(input, { target: { value: testUrl } });
      expect(onChange).toHaveBeenCalledWith(testUrl);
    });
  });

  it('handles empty string input', () => {
    const onChange = vi.fn();
    render(<UrlInput value="initial" onChange={onChange} />);

    const input = screen.getByPlaceholderText('https://api.example.com');
    fireEvent.change(input, { target: { value: '' } });

    expect(onChange).toHaveBeenCalledWith('');
  });

  it('handles special characters in URLs', () => {
    const onChange = vi.fn();
    render(<UrlInput value="" onChange={onChange} />);

    const input = screen.getByPlaceholderText('https://api.example.com');
    const urlWithSpecialChars = 'https://api.example.com/path?query=value&other=test%20space';

    fireEvent.change(input, { target: { value: urlWithSpecialChars } });

    expect(onChange).toHaveBeenCalledWith(urlWithSpecialChars);
  });
});
