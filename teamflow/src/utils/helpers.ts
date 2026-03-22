// Generic utilities — these all need generic type params in TS

export function groupBy<T>(array: T[], key: keyof T | ((item: T) => string)): Record<string, T[]> {
  return array.reduce<Record<string, T[]>>((groups, item) => {
    const val = typeof key === 'function' ? key(item) : String(item[key]);
    groups[val] = groups[val] || [];
    groups[val].push(item);
    return groups;
  }, {});
}

export function sortBy<T>(array: T[], key: keyof T | ((item: T) => string | number), direction?: 'asc' | 'desc'): T[] {
  const dir = direction === 'desc' ? -1 : 1;
  return [...array].sort((a, b) => {
    const aVal = typeof key === 'function' ? key(a) : a[key];
    const bVal = typeof key === 'function' ? key(b) : b[key];
    if (aVal < bVal) return -1 * dir;
    if (aVal > bVal) return 1 * dir;
    return 0;
  });
}

export function uniqueBy<T>(array: T[], key: keyof T | ((item: T) => unknown)): T[] {
  const seen = new Set<unknown>();
  return array.filter(item => {
    const val = typeof key === 'function' ? key(item) : item[key];
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
}

export function pick<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  return keys.reduce((result, key) => {
    if (key in obj) result[key] = obj[key];
    return result;
  }, {} as Pick<T, K>);
}

export function omit<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  return Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k as K))) as Omit<T, K>;
}

// HACK: deep clone without structuredClone for older browser support
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function debounce<T extends (...args: Parameters<T>) => void>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: unknown, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// TODO: replace with proper UUID library
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}
