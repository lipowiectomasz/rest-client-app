import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/codegen/curl', () => ({ generateCurl: vi.fn(() => 'curl code') }));
vi.mock('@/lib/codegen/js-fetch', () => ({ generateJsFetch: vi.fn(() => 'fetch code') }));
vi.mock('@/lib/codegen/js-xhr', () => ({ generateJsXhr: vi.fn(() => 'xhr code') }));
vi.mock('@/lib/codegen/node', () => ({ generateNode: vi.fn(() => 'node code') }));
vi.mock('@/lib/codegen/python', () => ({ generatePython: vi.fn(() => 'python code') }));
vi.mock('@/lib/codegen/java', () => ({ generateJava: vi.fn(() => 'java code') }));
vi.mock('@/lib/codegen/csharp', () => ({ generateCSharp: vi.fn(() => 'csharp code') }));
vi.mock('@/lib/codegen/go', () => ({ generateGo: vi.fn(() => 'go code') }));

import { CodegenPanel } from './CodegenPanel';
import { type HttpRequestSnapshot } from '@/lib/types';
import { type Variable } from '@/lib/variables/variablesStorage';
import { generateCurl } from '@/lib/codegen/curl';
import { generateJsFetch } from '@/lib/codegen/js-fetch';
import { generateGo } from '@/lib/codegen/go';

describe('<CodegenPanel />', () => {
  const request: HttpRequestSnapshot = {
    method: 'GET',
    url: 'https://api.example.com',
    headers: [{ key: 'Accept', value: 'application/json' }],
    body: '',
  };

  const variables: Variable[] = [
    { key: 'api_key', value: 'secret123' },
    { key: 'host', value: 'api.example.com' },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
    const clip = { writeText: vi.fn() } as unknown as Clipboard;
    Object.defineProperty(global.navigator, 'clipboard', { value: clip, configurable: true });
  });

  it('renders curl code by default', () => {
    render(<CodegenPanel request={request} variables={variables} />);
    expect(screen.getByText('curl')).toBeInTheDocument();
    expect(screen.getByText(/curl code/)).toBeInTheDocument();
    expect(generateCurl).toHaveBeenCalledWith(request, variables);
  });

  it('calls generators with variables when provided', () => {
    render(<CodegenPanel request={request} variables={variables} />);

    fireEvent.click(screen.getByRole('button', { name: 'jsFetch' }));
    expect(generateJsFetch).toHaveBeenCalledWith(request, variables);

    fireEvent.click(screen.getByRole('button', { name: 'curl' }));
    expect(generateCurl).toHaveBeenCalledWith(request, variables);
  });

  it('calls generators without variables when not provided', () => {
    render(<CodegenPanel request={request} />);

    fireEvent.click(screen.getByRole('button', { name: 'jsFetch' }));
    expect(generateJsFetch).toHaveBeenCalledWith(request, []);

    fireEvent.click(screen.getByRole('button', { name: 'curl' }));
    expect(generateCurl).toHaveBeenCalledWith(request, []);
  });

  it('switches language and updates code', () => {
    render(<CodegenPanel request={request} variables={variables} />);
    fireEvent.click(screen.getByRole('button', { name: 'jsFetch' }));
    expect(generateJsFetch).toHaveBeenCalledWith(request, variables);
    expect(screen.getByText(/fetch code/)).toBeInTheDocument();
  });

  it('shows fallback when generator throws', () => {
    (generateGo as unknown as ReturnType<typeof vi.fn>).mockImplementationOnce(() => {
      throw new Error('boom');
    });
    render(<CodegenPanel request={request} variables={variables} />);
    fireEvent.click(screen.getByRole('button', { name: 'go' }));
    expect(screen.getByText(/Not enough details to generate code/)).toBeInTheDocument();
  });

  it('copies current code to clipboard', () => {
    render(<CodegenPanel request={request} variables={variables} />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    const clip = navigator.clipboard as Clipboard & { writeText: (data: string) => Promise<void> };
    expect(clip.writeText as unknown as ReturnType<typeof vi.fn>).toHaveBeenCalledWith('curl code');

    fireEvent.click(screen.getByRole('button', { name: 'jsFetch' }));
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    expect(clip.writeText as unknown as ReturnType<typeof vi.fn>).toHaveBeenLastCalledWith(
      'fetch code',
    );
  });

  it('handles empty variables array', () => {
    render(<CodegenPanel request={request} variables={[]} />);
    fireEvent.click(screen.getByRole('button', { name: 'jsFetch' }));
    expect(generateJsFetch).toHaveBeenCalledWith(request, []);
  });

  it('recomputes code when variables change', () => {
    const { rerender } = render(<CodegenPanel request={request} variables={[]} />);
    expect(generateCurl).toHaveBeenCalledWith(request, []);

    rerender(<CodegenPanel request={request} variables={variables} />);
    expect(generateCurl).toHaveBeenCalledWith(request, variables);
  });
});
