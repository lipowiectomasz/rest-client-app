export type Variable = {
  key: string;
  value: string;
};

const STORAGE_KEY = 'rest-client-variables';

export function loadVariables(): Variable[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveVariables(vars: Variable[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vars));
}

export function addVariable(vars: Variable[], variable: Variable): Variable[] {
  const filtered = vars.filter((v) => v.key !== variable.key);
  const updated = [...filtered, variable];
  saveVariables(updated);
  return updated;
}

export function removeVariable(vars: Variable[], key: string): Variable[] {
  const updated = vars.filter((v) => v.key !== key);
  saveVariables(updated);
  return updated;
}
