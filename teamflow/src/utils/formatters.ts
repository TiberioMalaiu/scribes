import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';

type DateStyle = 'short' | 'relative' | 'smart' | 'full';

export function formatDate(date: Date | string, style: DateStyle = 'short'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;

  if (style === 'relative') return formatDistanceToNow(d, { addSuffix: true });
  if (style === 'smart') {
    if (isToday(d)) return `Today at ${format(d, 'h:mm a')}`;
    if (isYesterday(d)) return `Yesterday at ${format(d, 'h:mm a')}`;
    return format(d, 'MMM d, yyyy');
  }
  if (style === 'full') return format(d, 'MMMM d, yyyy h:mm a');
  return format(d, 'MMM d');
}

// No JSDoc — the "other developer" style
export function formatCurrency(amount: number, currency?: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(amount);
}

export function truncate(text: string | null | undefined, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '\u2026';
}

export function formatFileSize(bytes: number): string {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural || singular + 's');
}
