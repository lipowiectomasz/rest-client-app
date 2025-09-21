import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HeadersEditor } from './HeadersEditor';

vi.mock('@/data/commonHeaderKeys', () => ({
  COMMON_HEADER_KEYS: ['Content-Type', 'Authorization', 'User-Agent', 'Accept'],
}));

describe('<HeadersEditor />', () => {
  it('renders with initial headers', () => {
    const initialHeaders = [
      { key: 'Content-Type', value: 'application/json' },
      { key: 'Authorization', value: 'Bearer token' },
    ];

    render(<HeadersEditor value={initialHeaders} onChange={() => {}} />);

    const keyInputs = screen.getAllByPlaceholderText('Header Key');
    const valueInputs = screen.getAllByPlaceholderText('Header Value');

    expect(keyInputs).toHaveLength(2);
    expect(valueInputs).toHaveLength(2);
    expect((keyInputs[0] as HTMLInputElement).value).toBe('Content-Type');
    expect((valueInputs[0] as HTMLInputElement).value).toBe('application/json');
    expect((keyInputs[1] as HTMLInputElement).value).toBe('Authorization');
    expect((valueInputs[1] as HTMLInputElement).value).toBe('Bearer token');
  });

  it('renders empty when no headers provided', () => {
    render(<HeadersEditor value={[]} onChange={() => {}} />);

    const keyInputs = screen.queryAllByPlaceholderText('Header Key');
    const valueInputs = screen.queryAllByPlaceholderText('Header Value');

    expect(keyInputs).toHaveLength(0);
    expect(valueInputs).toHaveLength(0);
  });

  it('calls onChange when header key is updated', () => {
    const onChange = vi.fn();
    const initialHeaders = [{ key: 'Content-Type', value: 'application/json' }];

    render(<HeadersEditor value={initialHeaders} onChange={onChange} />);

    const keyInput = screen.getByPlaceholderText('Header Key');
    fireEvent.change(keyInput, { target: { value: 'Authorization' } });

    expect(onChange).toHaveBeenCalledWith([{ key: 'Authorization', value: 'application/json' }]);
  });

  it('calls onChange when header value is updated', () => {
    const onChange = vi.fn();
    const initialHeaders = [{ key: 'Content-Type', value: 'application/json' }];

    render(<HeadersEditor value={initialHeaders} onChange={onChange} />);

    const valueInput = screen.getByPlaceholderText('Header Value');
    fireEvent.change(valueInput, { target: { value: 'text/plain' } });

    expect(onChange).toHaveBeenCalledWith([{ key: 'Content-Type', value: 'text/plain' }]);
  });

  it('calls onChange when header is removed', () => {
    const onChange = vi.fn();
    const initialHeaders = [
      { key: 'Content-Type', value: 'application/json' },
      { key: 'Authorization', value: 'Bearer token' },
    ];

    render(<HeadersEditor value={initialHeaders} onChange={onChange} />);

    const removeButtons = screen.getAllByText('✕');
    fireEvent.click(removeButtons[0]);

    expect(onChange).toHaveBeenCalledWith([{ key: 'Authorization', value: 'Bearer token' }]);
  });

  it('shows dropdown when key input is focused', () => {
    render(<HeadersEditor value={[{ key: '', value: '' }]} onChange={() => {}} />);

    const keyInput = screen.getByPlaceholderText('Header Key');
    fireEvent.focus(keyInput);

    expect(screen.getByText('Content-Type')).toBeInTheDocument();
    expect(screen.getByText('Authorization')).toBeInTheDocument();
  });

  it('filters dropdown items based on input', () => {
    render(<HeadersEditor value={[{ key: '', value: '' }]} onChange={() => {}} />);

    const keyInput = screen.getByPlaceholderText('Header Key');
    fireEvent.focus(keyInput);
    fireEvent.change(keyInput, { target: { value: 'auth' } });

    expect(screen.getByText('Authorization')).toBeInTheDocument();
    expect(screen.queryByText('Content-Type')).not.toBeInTheDocument();
  });

  it('shows "No matches" when filter has no results', () => {
    render(<HeadersEditor value={[{ key: '', value: '' }]} onChange={() => {}} />);

    const keyInput = screen.getByPlaceholderText('Header Key');
    fireEvent.focus(keyInput);
    fireEvent.change(keyInput, { target: { value: 'nonexistent' } });

    expect(screen.getByText('No matches')).toBeInTheDocument();
  });

  it('selects header from dropdown and updates input', () => {
    const onChange = vi.fn();
    render(<HeadersEditor value={[{ key: '', value: '' }]} onChange={onChange} />);

    const keyInput = screen.getByPlaceholderText('Header Key');
    fireEvent.focus(keyInput);

    const contentTypeOption = screen.getByText('Content-Type');
    fireEvent.mouseDown(contentTypeOption);

    expect(onChange).toHaveBeenCalledWith([{ key: 'Content-Type', value: '' }]);
  });

  it('closes dropdown when clicking outside', () => {
    render(<HeadersEditor value={[{ key: '', value: '' }]} onChange={() => {}} />);

    const keyInput = screen.getByPlaceholderText('Header Key');
    fireEvent.focus(keyInput);

    expect(screen.getByText('Content-Type')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    expect(screen.queryByText('Content-Type')).not.toBeInTheDocument();
  });

  it('updates when prop value changes', () => {
    const { rerender } = render(
      <HeadersEditor value={[{ key: 'old', value: 'value' }]} onChange={() => {}} />,
    );

    expect(screen.getByPlaceholderText('Header Key')).toHaveValue('old');

    rerender(<HeadersEditor value={[{ key: 'new', value: 'value' }]} onChange={() => {}} />);

    expect(screen.getByPlaceholderText('Header Key')).toHaveValue('new');
  });

  it('handles multiple headers correctly', () => {
    const onChange = vi.fn();
    const initialHeaders = [
      { key: 'Header1', value: 'Value1' },
      { key: 'Header2', value: 'Value2' },
    ];

    render(<HeadersEditor value={initialHeaders} onChange={onChange} />);

    const valueInputs = screen.getAllByPlaceholderText('Header Value');

    fireEvent.change(valueInputs[1], { target: { value: 'UpdatedValue2' } });

    expect(onChange).toHaveBeenCalledWith([
      { key: 'Header1', value: 'Value1' },
      { key: 'Header2', value: 'UpdatedValue2' },
    ]);
  });
});
