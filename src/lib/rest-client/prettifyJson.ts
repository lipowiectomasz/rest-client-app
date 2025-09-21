export function prettifyJson(jsonString: string): string | null {
  try {
    return JSON.stringify(JSON.parse(jsonString), null, 2);
  } catch {
    return null;
  }
}
