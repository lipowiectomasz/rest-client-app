import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import VariablesPage from './VariablesPage'; // Adjust import path as needed
import { loadVariables, addVariable, removeVariable } from '@/lib/variables/variablesStorage';
import Box from '../ui/Box';

// Mock the variables storage functions
vi.mock('@/lib/variables/variablesStorage', () => ({
  loadVariables: vi.fn(),
  addVariable: vi.fn(),
  removeVariable: vi.fn(),
}));

// Mock the Box component
vi.mock('../ui/Box', () => ({
  default: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
}));

describe('<VariablesPage />', () => {
  const mockVariables = [
    { key: 'api_url', value: 'https://api.example.com' },
    { key: 'token', value: 'secret123' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (loadVariables as vi.Mock).mockReturnValue(mockVariables);
    (addVariable as vi.Mock).mockImplementation((vars, newVar) => [...vars, newVar]);
    (removeVariable as vi.Mock).mockImplementation((vars, key) =>
      vars.filter((v) => v.key !== key),
    );
  });

  it('renders the component with title and form', () => {
    render(<VariablesPage />);

    expect(screen.getByText('Variables')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Key')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Value')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });

  it('shows "No variables" message when there are no variables', () => {
    (loadVariables as vi.Mock).mockReturnValue([]);

    render(<VariablesPage />);

    expect(screen.getByText('No variables')).toBeInTheDocument();
    expect(screen.queryByText('api_url:')).not.toBeInTheDocument();
  });

  it('does not add variable when key is empty', () => {
    render(<VariablesPage />);

    const keyInput = screen.getByPlaceholderText('Key');
    const valueInput = screen.getByPlaceholderText('Value');
    const addButton = screen.getByRole('button', { name: 'Add' });

    fireEvent.change(keyInput, { target: { value: '   ' } }); // Whitespace only
    fireEvent.change(valueInput, { target: { value: 'some_value' } });
    fireEvent.click(addButton);

    expect(addVariable).not.toHaveBeenCalled();
  });

  it('trims key when adding variable', () => {
    render(<VariablesPage />);

    const keyInput = screen.getByPlaceholderText('Key');
    const valueInput = screen.getByPlaceholderText('Value');
    const addButton = screen.getByRole('button', { name: 'Add' });

    fireEvent.change(keyInput, { target: { value: '  trimmed_key  ' } });
    fireEvent.change(valueInput, { target: { value: 'value' } });
    fireEvent.click(addButton);

    expect(addVariable).toHaveBeenCalledWith(mockVariables, { key: 'trimmed_key', value: 'value' });
  });

  it('removes a variable when remove button is clicked', () => {
    render(<VariablesPage />);

    const removeButtons = screen.getAllByRole('button', { name: /Remove/ });
    fireEvent.click(removeButtons[0]); // Remove first variable

    expect(removeVariable).toHaveBeenCalledWith(mockVariables, 'api_url');
  });

  it('handles form submission with enter key', () => {
    render(<VariablesPage />);

    const keyInput = screen.getByPlaceholderText('Key');
    const valueInput = screen.getByPlaceholderText('Value');

    fireEvent.change(keyInput, { target: { value: 'enter_key' } });
    fireEvent.change(valueInput, { target: { value: 'enter_value' } });
    fireEvent.submit(keyInput.closest('form')!);

    expect(addVariable).toHaveBeenCalledWith(mockVariables, {
      key: 'enter_key',
      value: 'enter_value',
    });
  });

  it('clears input fields after adding variable', () => {
    render(<VariablesPage />);

    const keyInput = screen.getByPlaceholderText('Key') as HTMLInputElement;
    const valueInput = screen.getByPlaceholderText('Value') as HTMLInputElement;
    const addButton = screen.getByRole('button', { name: 'Add' });

    fireEvent.change(keyInput, { target: { value: 'test_key' } });
    fireEvent.change(valueInput, { target: { value: 'test_value' } });
    fireEvent.click(addButton);

    expect(keyInput.value).toBe('');
    expect(valueInput.value).toBe('');
  });

  it('applies correct styling to table elements', () => {
    render(<VariablesPage />);

    const firstKey = screen.getByText('api_url');
    expect(firstKey).toHaveClass('font-semibold');

    const removeButtons = screen.getAllByText('X');
    expect(removeButtons[0]).toHaveClass('text-red-600');
    expect(removeButtons[0]).toHaveClass('hover:underline');
  });

  it('handles zebra striping for table rows', () => {
    render(<VariablesPage />);

    const rows = screen.getAllByRole('row').slice(1); // Skip header row

    rows.forEach((row, index) => {
      if (index % 2 === 0) {
        expect(row).toHaveClass('odd:bg-slate-50');
      } else {
        expect(row).toHaveClass('even:bg-white');
      }
    });
  });

  it('has proper accessibility attributes', () => {
    render(<VariablesPage />);

    const removeButtons = screen.getAllByRole('button', { name: /Remove/ });
    expect(removeButtons[0]).toHaveAttribute('aria-label', 'Remove api_url');
    expect(removeButtons[1]).toHaveAttribute('aria-label', 'Remove token');
  });

  it('applies correct CSS classes to form elements', () => {
    render(<VariablesPage />);

    const keyInput = screen.getByPlaceholderText('Key');
    const valueInput = screen.getByPlaceholderText('Value');
    const addButton = screen.getByRole('button', { name: 'Add' });

    expect(keyInput).toHaveClass('focus:ring-indigo-500');
    expect(keyInput).toHaveClass('bg-slate-50');
    expect(keyInput).toHaveClass('rounded-md');

    expect(valueInput).toHaveClass('focus:ring-indigo-500');
    expect(valueInput).toHaveClass('bg-slate-50');

    expect(addButton).toHaveClass('bg-slate-100');
    expect(addButton).toHaveClass('shadow-indigo-600');
    expect(addButton).toHaveClass('focus:ring-indigo-500');
  });
});
