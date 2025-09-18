import React from 'react';

interface ButtonConfig {
  label: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'group';
}

interface ButtonsBarProps {
  buttons: ButtonConfig[];
}

export function ButtonsBar({ buttons }: ButtonsBarProps) {
  const baseStyles = 'px-4 py-2 font-medium transition focus:outline-none w-full rounded-md';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-300 text-gray-800 hover:bg-gray-400',
    success: 'bg-green-500 text-white hover:bg-green-600',
    group:
      'my-2 dark:bg-slate-800 bg-slate-100 hover:bg-indigo-200 border border-indigo-200 text-indigo-600 focus:ring-2 focus:ring-indigo-500',
  };

  return (
    <div className="flex items-center justify-evenly overflow-hidden bg-white">
      {buttons.map((btn, idx) => (
        <button
          key={idx}
          onClick={btn.onClick}
          className={`${baseStyles} ${variants[btn.variant ?? 'primary']}`}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
}
