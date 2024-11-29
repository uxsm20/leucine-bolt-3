import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface FormCheckboxGroupProps {
  label: string;
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  error?: string;
  helperText?: string;
  className?: string;
}

export const FormCheckboxGroup: React.FC<FormCheckboxGroupProps> = ({
  label,
  options,
  selectedValues,
  onChange,
  error,
  helperText,
  className = ''
}) => {
  const handleChange = (value: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedValues, value]);
    } else {
      onChange(selectedValues.filter(v => v !== value));
    }
  };

  return (
    <div className={`mb-6 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label}
      </label>
      {options.length > 0 ? (
        <div className="space-y-3">
          {options.map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                type="checkbox"
                id={`${option.value}-checkbox`}
                checked={selectedValues.includes(option.value)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange([...selectedValues, option.value]);
                  } else {
                    onChange(selectedValues.filter((v) => v !== option.value));
                  }
                }}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 
                         focus:ring-blue-500 focus:ring-2 focus:ring-offset-2"
              />
              <label
                htmlFor={`${option.value}-checkbox`}
                className="ml-3 text-sm text-gray-700"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      ) : null}
      {(error || helperText) && options.length > 0 && (
        <p className={`mt-2 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};
