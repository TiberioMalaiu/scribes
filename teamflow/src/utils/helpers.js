// Generic utilities — these all need generic type params in TS

export function groupBy(array, key) {
  return array.reduce((groups, item) => {
    const val = typeof key === 'function' ? key(item) : item[key];
    groups[val] = groups[val] || [];
    groups[val].push(item);
    return groups;
  }, {});
}

export function sortBy(array, key, direction) {
  const dir = direction === 'desc' ? -1 : 1;
  return [...array].sort((a, b) => {
    const aVal = typeof key === 'function' ? key(a) : a[key];
    const bVal = typeof key === 'function' ? key(b) : b[key];
    if (aVal < bVal) return -1 * dir;
    if (aVal > bVal) return 1 * dir;
    return 0;
  });
}

export function uniqueBy(array, key) {
  const seen = new Set();
  return array.filter(item => {
    const val = typeof key === 'function' ? key(item) : item[key];
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
}

export function pick(obj, keys) {
  return keys.reduce((result, key) => {
    if (key in obj) result[key] = obj[key];
    return result;
  }, {});
}

export function omit(obj, keys) {
  return Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)));
}

// HACK: deep clone without structuredClone for older browser support
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// TODO: replace with proper UUID library
export function generateId() {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}
