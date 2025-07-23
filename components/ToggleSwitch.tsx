
import React from 'react';

type PriceType = 'net' | 'gross';

interface ToggleSwitchProps {
  selected: PriceType;
  setSelected: (value: PriceType) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ selected, setSelected }) => {
  const commonClasses = "px-3 py-1 text-xs font-bold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-orange-500";
  const activeClasses = "bg-orange-500 text-white shadow";
  const inactiveClasses = "bg-slate-600 text-slate-300 hover:bg-slate-500";

  return (
    <div className="flex items-center bg-slate-700 rounded-lg p-1 space-x-1">
      <button
        onClick={() => setSelected('net')}
        className={`${commonClasses} ${selected === 'net' ? activeClasses : inactiveClasses}`}
        aria-pressed={selected === 'net'}
      >
        NETTO
      </button>
      <button
        onClick={() => setSelected('gross')}
        className={`${commonClasses} ${selected === 'gross' ? activeClasses : inactiveClasses}`}
        aria-pressed={selected === 'gross'}
      >
        BRUTTO
      </button>
    </div>
  );
};

export default ToggleSwitch;
