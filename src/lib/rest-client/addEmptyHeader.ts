import { Header } from '@/types/restClient';

export function addEmptyHeader(headers: Header[]): Header[] {
  return [...headers, { key: '', value: '' }];
}
