import React from 'react';
import { TimeSlot } from '../../types/scheduler';

interface Props {
  value: TimeSlot;
  onChange: (value: TimeSlot) => void;
  onRemove?: () => void;
}

export const TimeSlotInput: React.FC<Props> = ({ value, onChange, onRemove }) => {
  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...value, hour: parseInt(e.target.value) });
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...value, minute: parseInt(e.target.value) });
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="flex-1 flex items-center space-x-2">
        <select
          value={value.hour}
          onChange={handleHourChange}
          className="block w-20 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900
                   ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500
                   sm:text-sm sm:leading-6"
        >
          {Array.from({ length: 24 }, (_, i) => (
            <option key={i} value={i}>
              {i.toString().padStart(2, '0')}
            </option>
          ))}
        </select>
        <span className="text-gray-500">:</span>
        <select
          value={value.minute}
          onChange={handleMinuteChange}
          className="block w-20 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900
                   ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-500
                   sm:text-sm sm:leading-6"
        >
          {Array.from({ length: 60 }, (_, i) => (
            <option key={i} value={i}>
              {i.toString().padStart(2, '0')}
            </option>
          ))}
        </select>
      </div>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center p-1 border border-transparent rounded-full
                   shadow-sm text-red-600 hover:text-red-700 focus:outline-none"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};