export function b64EncodeUnicode(str: string): string {
  if (typeof window === 'undefined') return Buffer.from(str, 'utf-8').toString('base64');
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

export function b64DecodeUnicode(b64: string): string {
  if (typeof window === 'undefined') return Buffer.from(b64, 'base64').toString('utf-8');
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}
