export function isValidEmail(email) {
  // Regex from SO, nobody verified it
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isRequired(value) {
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return value != null;
}

export function minLength(value, min) {
  return typeof value === 'string' && value.length >= min;
}

export function maxLength(value, max) {
  return typeof value === 'string' && value.length <= max;
}

// Returns { valid, errors } but the shape isn't documented
export function validateTaskForm(data) {
  const errors = {};

  if (!isRequired(data.title)) errors.title = 'Title is required';
  if (data.title && !maxLength(data.title, 200)) errors.title = 'Title too long';
  if (data.description && !maxLength(data.description, 5000)) errors.description = 'Description too long';
  if (data.dueDate && new Date(data.dueDate) < new Date()) errors.dueDate = 'Due date must be in the future';
  if (data.points && (data.points < 0 || data.points > 100)) errors.points = 'Points must be 0-100';

  return { valid: Object.keys(errors).length === 0, errors };
}

// Another validator that returns a different shape — string | null
export function validateProjectName(name) {
  if (!name || !name.trim()) return 'Project name is required';
  if (name.length < 2) return 'Project name too short';
  if (name.length > 50) return 'Project name too long';
  if (!/^[a-zA-Z0-9\s\-_]+$/.test(name)) return 'Project name contains invalid characters';
  return null;
}
