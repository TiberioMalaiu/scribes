import { differenceInDays, addDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

export function getDateRange(preset) {
  const now = new Date();

  switch (preset) {
    case 'today':
      return { start: now, end: now };
    case 'week':
      return { start: startOfWeek(now), end: endOfWeek(now) };
    case 'month':
      return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: now };
    case 'quarter': {
      const qStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
      return { start: qStart, end: now };
    }
    default:
      return { start: now, end: now };
  }
}

export function getWorkingDays(startDate, endDate) {
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  return days.filter(d => d.getDay() !== 0 && d.getDay() !== 6);
}

export function isOverdue(dueDate) {
  if (!dueDate) return false;
  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  return due < new Date() && due.toDateString() !== new Date().toDateString();
}

export function getDaysUntilDue(dueDate) {
  if (!dueDate) return null;
  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  return differenceInDays(due, new Date());
}

// Returns a sprint-like structure — used in charts
export function generateSprintDates(startDate, lengthInWeeks) {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = addDays(start, lengthInWeeks * 7 - 1);
  return {
    start,
    end,
    days: eachDayOfInterval({ start, end }),
    workingDays: getWorkingDays(start, end),
  };
}
