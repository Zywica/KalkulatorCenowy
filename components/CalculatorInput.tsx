
import React from 'react';

interface CalculatorInputProps {
  id: string;
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  unit: string;
  icon: React.ReactNode;
}

const CalculatorInput: React.FC<CalculatorInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  unit,
  icon,
}) => {
  return (
    <div className="relative w-full">
      {label && <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-2">
        {label}
      </label>}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
          {icon}
        </div>
        <input
          type="number"
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder || ''}
          className="w-full bg-slate-700 border border-slate-600 rounded-lg text-white text-lg py-3 pr-14 pl-10 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
          min="0"
          step="0.01"
          aria-label={label || id}
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-300 font-semibold">
          {unit}
        </div>
      </div>
    </div>
  );
};

export default CalculatorInput;
