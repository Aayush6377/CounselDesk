import React, { useState, useEffect, useRef } from 'react';
import { MdOutlineExpandMore } from 'react-icons/md';

const CustomSelect = ({ name, value, options, onChange, ...rest }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (optionValue) => {
    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);
  };

  const selectedOptionLabel = options.find(opt => opt.value === value)?.label || options[0]?.label;

  return (
    <div className="relative w-full sm:w-60" ref={selectRef} {...rest}>
      {/* The visible select box/button */}
      <div 
        className="flex items-center justify-between w-full h-12 bg-black/30 border border-white/10 rounded-lg text-[var(--accent-color)] pl-4 pr-10 cursor-pointer focus:ring-2 focus:ring-[var(--primary-color)] transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOptionLabel}</span>
        <MdOutlineExpandMore className={`ml-2 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* The custom dropdown menu */}
      {isOpen && (
        <div className="absolute top-14 left-0 w-full rounded-lg bg-[var(--secondary-color)] border border-white/10 z-20 shadow-lg">
          {options.map((option) => (
            <div
              key={option.value}
              className={`py-2 px-4 text-sm cursor-pointer transition-colors ${
                option.value === value
                  ? 'bg-black/40 text-[var(--primary-color)] font-semibold'
                  : 'text-gray-400 hover:bg-black/30 hover:text-[var(--accent-color)]'
              } rounded-lg`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
