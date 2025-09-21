import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DeleteButton from './DeleteButton';

vi.mock('@heroicons/react/24/outline', () => ({
  TrashIcon: () => <svg data-testid="trash-icon" className="h-4 w-4" />,
}));

const mockFetch = vi.fn();
const mockAlert = vi.fn();
const mockConfirm = vi.fn();

global.fetch = mockFetch;
global.alert = mockAlert;
global.confirm = mockConfirm;

describe('<DeleteButton />', () => {
  const mockOnDelete = vi.fn();
  const historyId = 'test-id-123';

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
    mockAlert.mockReset();
    mockConfirm.mockReset();
    mockOnDelete.mockReset();
  });

  it('renders delete button with trash icon', () => {
    render(<DeleteButton historyId={historyId} onDelete={mockOnDelete} />);

    const button = screen.getByTitle('Delete this request');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('text-red-600');
    expect(button).toHaveClass('hover:text-red-900');
    expect(button).toHaveClass('p-1');
    expect(button).toHaveClass('rounded-md');
    expect(button).toHaveClass('hover:bg-red-100');
    expect(button).toHaveClass('transition-colors');
    expect(button).toHaveClass('cursor-pointer');

    expect(screen.getByTestId('trash-icon')).toBeInTheDocument();
  });

  it('shows confirmation dialog when clicked', async () => {
    mockConfirm.mockReturnValue(true);
    mockFetch.mockResolvedValueOnce({ ok: true });

    render(<DeleteButton historyId={historyId} onDelete={mockOnDelete} />);

    const button = screen.getByTitle('Delete this request');
    fireEvent.click(button);

    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this history item?');
  });

  it('does not proceed with deletion if user cancels confirmation', async () => {
    mockConfirm.mockReturnValue(false);

    render(<DeleteButton historyId={historyId} onDelete={mockOnDelete} />);

    const button = screen.getByTitle('Delete this request');
    fireEvent.click(button);

    expect(mockConfirm).toHaveBeenCalled();
    expect(mockFetch).not.toHaveBeenCalled();
    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  it('calls delete API and invokes onDelete on success', async () => {
    mockConfirm.mockReturnValue(true);
    mockFetch.mockResolvedValueOnce({ ok: true });

    render(<DeleteButton historyId={historyId} onDelete={mockOnDelete} />);

    const button = screen.getByTitle('Delete this request');
    fireEvent.click(button);

    expect(mockFetch).toHaveBeenCalledWith(`/api/history/${historyId}`, {
      method: 'DELETE',
    });

    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith(historyId);
    });
  });

  it('shows alert and does not call onDelete when API fails', async () => {
    mockConfirm.mockReturnValue(true);
    mockFetch.mockResolvedValueOnce({ ok: false });

    render(<DeleteButton historyId={historyId} onDelete={mockOnDelete} />);

    const button = screen.getByTitle('Delete this request');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Failed to delete history item');
      expect(mockOnDelete).not.toHaveBeenCalled();
    });
  });

  it('shows alert and does not call onDelete when fetch throws error', async () => {
    mockConfirm.mockReturnValue(true);
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<DeleteButton historyId={historyId} onDelete={mockOnDelete} />);

    const button = screen.getByTitle('Delete this request');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Error deleting history item');
      expect(mockOnDelete).not.toHaveBeenCalled();
    });
  });

  it('disables button during deletion process', async () => {
    mockConfirm.mockReturnValue(true);
    mockFetch.mockResolvedValueOnce({ ok: true });

    render(<DeleteButton historyId={historyId} onDelete={mockOnDelete} />);

    const button = screen.getByTitle('Delete this request');
    expect(button).not.toBeDisabled();

    fireEvent.click(button);

    expect(button).toBeDisabled();

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });

  it('handles multiple clicks gracefully', async () => {
    mockConfirm.mockReturnValue(true);
    mockFetch.mockResolvedValueOnce({ ok: true });

    render(<DeleteButton historyId={historyId} onDelete={mockOnDelete} />);

    const button = screen.getByTitle('Delete this request');

    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockOnDelete).toHaveBeenCalledTimes(1);
    });
  });

  it('shows loading state during API call', async () => {
    mockConfirm.mockReturnValue(true);

    let resolveFetch: (value: { ok: boolean }) => void;
    const fetchPromise = new Promise<{ ok: boolean }>((resolve) => {
      resolveFetch = resolve;
    });
    mockFetch.mockReturnValueOnce(fetchPromise);

    render(<DeleteButton historyId={historyId} onDelete={mockOnDelete} />);

    const button = screen.getByTitle('Delete this request');
    fireEvent.click(button);

    expect(button).toBeDisabled();

    resolveFetch!({ ok: true });

    await waitFor(() => {
      expect(button).not.toBeDisabled();
      expect(mockOnDelete).toHaveBeenCalledWith(historyId);
    });
  });

  it('logs errors to console', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockConfirm.mockReturnValue(true);
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<DeleteButton historyId={historyId} onDelete={mockOnDelete} />);

    const button = screen.getByTitle('Delete this request');
    fireEvent.click(button);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error deleting history item:',
        expect.any(Error),
      );
    });

    consoleErrorSpy.mockRestore();
  });
});
