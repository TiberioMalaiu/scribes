import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  style?: React.CSSProperties;
  type?: 'button' | 'submit' | 'reset';
}

const baseStyle: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 600,
  transition: 'background 0.2s',
};

const variants: Record<ButtonVariant, React.CSSProperties> = {
  primary: { background: '#2563eb', color: '#fff' },
  secondary: { background: '#e5e7eb', color: '#374151' },
  danger: { background: '#ef4444', color: '#fff' },
  ghost: { background: 'transparent', color: '#6b7280', border: '1px solid #d1d5db' },
};

const sizes: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: '4px 10px', fontSize: '12px' },
  md: {},
  lg: { padding: '12px 24px', fontSize: '16px' },
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  onClick,
  style,
  type,
}: ButtonProps) => {
  const computedStyle: React.CSSProperties = {
    ...baseStyle,
    ...variants[variant],
    ...sizes[size],
    ...(fullWidth ? { width: '100%' } : {}),
    ...(disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
    ...style,
  };

  return (
    <button style={computedStyle} onClick={onClick} disabled={disabled} type={type}>
      {children}
    </button>
  );
};

export default Button;
