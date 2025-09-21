import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('../ui/Box', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

import { BodyEditor } from './BodyEditor';

describe('<BodyEditor />', () => {
  it('renders with initial value', () => {
    render(<BodyEditor value='{"a":1}' onChange={() => {}} />);
    const textarea = screen.getByPlaceholderText(/request body \(json\)/i) as HTMLTextAreaElement;
    expect(textarea.value).toBe('{"a":1}');
  });

  it('updates when prop value changes', () => {
    const { rerender } = render(<BodyEditor value="one" onChange={() => {}} />);
    const textarea = screen.getByPlaceholderText(/request body \(json\)/i) as HTMLTextAreaElement;
    expect(textarea.value).toBe('one');
    rerender(<BodyEditor value="two" onChange={() => {}} />);
    expect(textarea.value).toBe('two');
  });

  it('calls onChange when typing', () => {
    const onChange = vi.fn();
    render(<BodyEditor value="" onChange={onChange} />);
    const textarea = screen.getByPlaceholderText(/request body \(json\)/i);
    fireEvent.change(textarea, { target: { value: 'hello' } });
    expect(onChange).toHaveBeenCalledWith('hello');
  });

  it('inserts tab on Tab key and updates selection', async () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    render(<BodyEditor value="abc" onChange={onChange} />);
    const textarea = screen.getByPlaceholderText(/request body \(json\)/i) as HTMLTextAreaElement;

    textarea.focus();
    textarea.setSelectionRange(1, 2);
    fireEvent.keyDown(textarea, { key: 'Tab' });

    expect(onChange).toHaveBeenCalledWith('a\tc');
    expect((textarea as HTMLTextAreaElement).value).toBe('a\tc');

    await act(async () => {
      vi.runAllTimers();
    });

    expect(textarea.selectionStart).toBe(2);
    expect(textarea.selectionEnd).toBe(2);
    vi.useRealTimers();
  });
});
