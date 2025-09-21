import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRestClientRequest } from './useRestClientRequest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
  usePathname: () => '/rest-client/GET/dGVzdA==',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/app/lib/utils/base64', () => ({
  b64EncodeUnicode: (str: string) => btoa(str),
  b64DecodeUnicode: (str: string) => atob(str),
}));

vi.mock('@/lib/variables/variablesStorage', () => ({
  loadVariables: () => [],
}));

vi.mock('@/lib/variables/replaceVariables', () => ({
  replaceVariables: (str: string) => str,
  replaceVariablesInHeaders: (headers: any[]) => headers,
}));

vi.mock('./prettifyJson', () => ({
  prettifyJson: (json: string) => json,
}));

vi.mock('./addEmptyHeader', () => ({
  addEmptyHeader: (headers: any[]) => [...headers, { key: '', value: '' }],
}));

global.fetch = vi.fn();

describe('useRestClientRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as vi.Mock).mockResolvedValue({ json: () => ({}) });
  });

  it('initializes from URL', () => {
    const { result } = renderHook(() => useRestClientRequest());
    expect(result.current.method).toBe('GET');
    expect(result.current.url).toBe('test');
  });

  it('sends request', async () => {
    const { result } = renderHook(() => useRestClientRequest());

    await act(async () => {
      result.current.sendRequest();
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/proxy', expect.any(Object));
  });

  it('adds header', () => {
    const { result } = renderHook(() => useRestClientRequest());

    act(() => {
      result.current.addHeader();
    });

    expect(result.current.headers).toHaveLength(1);
  });
});
