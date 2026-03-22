import React, { useState } from 'react';
import './Dropdown.css';
import { useClickOutside } from '../../hooks/useClickOutside';

interface DropdownOption {
  label?: string;
  value?: string;
  icon?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  divider?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  options: DropdownOption[];
  onSelect: (option: DropdownOption) => void;
  align?: 'left' | 'right';
}

export default function Dropdown({ trigger, options, onSelect, align }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  const handleSelect = (option: DropdownOption) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="dropdown" ref={ref}>
      <div className="dropdown__trigger" onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && (
        <div className={`dropdown__menu ${align === 'right' ? 'dropdown__menu--right' : ''}`}>
          {options.map((option, i) => (
            option.divider ? (
              <div key={i} className="dropdown__divider" />
            ) : (
              <button
                key={option.value || i}
                className={`dropdown__item ${option.danger ? 'dropdown__item--danger' : ''}`}
                onClick={() => handleSelect(option)}
                disabled={option.disabled}
              >
                {option.icon && <span className="dropdown__icon">{option.icon}</span>}
                {option.label}
              </button>
            )
          ))}
        </div>
      )}
    </div>
  );
}
