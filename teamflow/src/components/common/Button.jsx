import React from 'react';
import PropTypes from 'prop-types';

const baseStyle = {
  padding: '8px 16px',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 600,
  transition: 'background 0.2s',
};

const variants = {
  primary: { background: '#2563eb', color: '#fff' },
  secondary: { background: '#e5e7eb', color: '#374151' },
  danger: { background: '#ef4444', color: '#fff' },
  ghost: { background: 'transparent', color: '#6b7280', border: '1px solid #d1d5db' },
};

const sizes = {
  sm: { padding: '4px 10px', fontSize: '12px' },
  md: {},
  lg: { padding: '12px 24px', fontSize: '16px' },
};

const Button = ({ children, variant, size, disabled, fullWidth, onClick, style }) => {
  const computedStyle = {
    ...baseStyle,
    ...variants[variant || 'primary'],
    ...sizes[size || 'md'],
    ...(fullWidth ? { width: '100%' } : {}),
    ...(disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
    ...style,
  };

  return (
    <button style={computedStyle} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  onClick: PropTypes.func,
  style: PropTypes.object,
};

Button.defaultProps = {
  variant: 'primary',
  size: 'md',
  disabled: false,
  fullWidth: false,
};

export default Button;
