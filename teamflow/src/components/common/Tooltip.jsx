import React, { useState, useRef, useEffect } from 'react';
import styles from './Tooltip.module.css';

export default function Tooltip({ children, content, position }) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);

  useEffect(() => {
    if (visible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const pos = position || 'top';

      switch (pos) {
        case 'top':
          setCoords({ top: rect.top - 8, left: rect.left + rect.width / 2 });
          break;
        case 'bottom':
          setCoords({ top: rect.bottom + 8, left: rect.left + rect.width / 2 });
          break;
        case 'left':
          setCoords({ top: rect.top + rect.height / 2, left: rect.left - 8 });
          break;
        case 'right':
          setCoords({ top: rect.top + rect.height / 2, left: rect.right + 8 });
          break;
        default:
          setCoords({ top: rect.top - 8, left: rect.left + rect.width / 2 });
      }
    }
  }, [visible, position]);

  return (
    <div
      className={styles.wrapper}
      ref={triggerRef}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && content && (
        <div
          className={`${styles.tooltip} ${styles[position || 'top']}`}
        >
          {content}
        </div>
      )}
    </div>
  );
}
