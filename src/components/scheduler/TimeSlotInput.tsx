import React from 'react';
import { TimeSlot } from '../../types/scheduler';
import { FormSelect } from '../shared/forms/FormSelect';

interface Props {
  value: TimeSlot;
  onChange: (value: TimeSlot) => void;
  onRemove?: () => void;
}

export const TimeSlotInput: React.FC<Props> = ({ value, onChange, onRemove }) => {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex-1">
        <FormSelect
          label="Hour"
          options={Array.from({ length: 24 }, (_, i) => ({
            value: i.toString(),
            label: i.toString().padStart(2, '0')
          }))}
          value={value.hour.toString()}
          onChange={(val) => onChange({ ...value, hour: parseInt(val) })}
          className="mb-0"
        />
      </div>
      <div className="flex-1">
        <FormSelect
          label="Minute"
          options={Array.from({ length: 60 }, (_, i) => ({
            value: i.toString(),
            label: i.toString().padStart(2, '0')
          }))}
          value={value.minute.toString()}
          onChange={(val) => onChange({ ...value, minute: parseInt(val) })}
          className="mb-0"
        />
      </div>
      {onRemove && (
        <div className="flex items-end pb-2">
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center justify-center p-2 rounded-full
                     text-gray-400 hover:text-gray-500 focus:outline-none
                     focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};