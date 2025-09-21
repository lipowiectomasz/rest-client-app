import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResponseViewer, type ResponseData } from './ResponseViewer';

vi.mock('next-intl', () => ({
  useTranslations: vi.fn((ns?: string) => (key: string) => `${ns}.${key}`),
}));

vi.mock('../ui/Box', () => ({
  default: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="box" className={className}>
      {children}
    </div>
  ),
}));

describe('ResponseViewer', () => {
  it('renders fallback when response is null', () => {
    render(<ResponseViewer response={null} />);
    expect(screen.getByTestId('box')).toBeInTheDocument();
    expect(screen.getByText('restClientPage.text.noResponse')).toBeInTheDocument();
  });

  it('renders array of header pairs', () => {
    const headers: ResponseData = [
      { key: 'Content-Type', value: 'application/json' },
      { key: 'X-Req-Id', value: 'abc123' },
    ];
    render(<ResponseViewer response={headers} />);

    expect(screen.getByText('restClientPage.text.response:')).toBeInTheDocument();
    expect(screen.getByText('Content-Type:')).toBeInTheDocument();
    expect(screen.getByText('application/json')).toBeInTheDocument();
    expect(screen.getByText('X-Req-Id:')).toBeInTheDocument();
    expect(screen.getByText('abc123')).toBeInTheDocument();
  });

  it('renders error message when response has error', () => {
    const resp: ResponseData = { error: 'Boom' };
    render(<ResponseViewer response={resp} />);

    expect(screen.getByText(/restClientPage\.text\.error:/)).toBeInTheDocument();
    expect(screen.getByText(/Boom/)).toBeInTheDocument();
  });

  it('renders status and string body', () => {
    const resp: ResponseData = { status: 200, body: 'OK' };
    render(<ResponseViewer response={resp} />);

    expect(screen.getByText(/Status:/)).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('OK')).toBeInTheDocument();
  });
});
