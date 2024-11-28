import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label: string;
  options: Option[];
  error?: string;
  helperText?: string;
  onChange: (value: string) => void;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  options,
  error,
  helperText,
  className = '',
  onChange,
  ...props
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        className={`
          block w-full rounded-md border-0 py-1.5 px-3
          text-gray-900 shadow-sm ring-1 ring-inset
          ${error 
            ? 'ring-red-300 focus:ring-red-500' 
            : 'ring-gray-300 focus:ring-blue-500'
          }
          focus:ring-2 focus:ring-inset
          disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500
          disabled:ring-gray-200
          sm:text-sm sm:leading-6
          ${className}
        `}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};
