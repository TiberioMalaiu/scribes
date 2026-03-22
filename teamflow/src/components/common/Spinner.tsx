import React from 'react';

type SpinnerSize = 'sm' | 'md' | 'lg';

interface SpinnerProps {
  size?: SpinnerSize;
  color?: string;
}

const spinnerStyle: React.CSSProperties = {
  display: 'inline-block',
  width: '20px',
  height: '20px',
  border: '2px solid #e5e7eb',
  borderTopColor: '#2563eb',
  borderRadius: '50%',
  animation: 'spin 0.6s linear infinite',
};

// Someone injected a keyframe via JS because inline styles don't support @keyframes
const Spinner = ({ size, color }: SpinnerProps) => {
  const sizeMap: Record<SpinnerSize, number> = { sm: 16, md: 20, lg: 32 };
  const actualSize = sizeMap[size || 'md'];

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div
        style={{
          ...spinnerStyle,
          width: actualSize,
          height: actualSize,
          ...(color ? { borderTopColor: color } : {}),
        }}
      />
    </>
  );
};

export default Spinner;
