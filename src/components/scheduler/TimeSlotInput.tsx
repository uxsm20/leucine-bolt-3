import React from 'react';
import { TimeSlot } from '../../types/scheduler';

interface Props {
  slot: TimeSlot;
  index: number;
  onUpdate: (index: number, field: 'hour' | 'minute', value: string) => void;
  onRemove: (index: number) => void;
}

export const TimeSlotInput: React.FC<Props> = ({ slot, index, onUpdate, onRemove }) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="number"
        min="0"
        max="23"
        value={slot.hour}
        onChange={(e) => onUpdate(index, 'hour', e.target.value)}
        className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        placeholder="Hour"
      />
      <span>:</span>
      <input
        type="number"
        min="0"
        max="59"
        value={slot.minute}
        onChange={(e) => onUpdate(index, 'minute', e.target.value)}
        className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        placeholder="Minute"
      />
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="text-red-600 hover:text-red-500"
      >
        Remove
      </button>
    </div>
  );
};