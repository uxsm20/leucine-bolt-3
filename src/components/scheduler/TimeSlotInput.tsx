import React from 'react';
import { TimeSlot } from '../../types/scheduler';

interface Props {
  value: TimeSlot;
  onChange: (slot: TimeSlot) => void;
}

export const TimeSlotInput: React.FC<Props> = ({ value, onChange }) => {
  const hour = value?.hour ?? 0;
  const minute = value?.minute ?? 0;

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHour = Math.min(23, Math.max(0, parseInt(e.target.value) || 0));
    onChange({ ...value, hour: newHour });
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinute = Math.min(59, Math.max(0, parseInt(e.target.value) || 0));
    onChange({ ...value, minute: newMinute });
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="number"
        min="0"
        max="23"
        value={hour}
        onChange={handleHourChange}
        className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        placeholder="Hour"
      />
      <span>:</span>
      <input
        type="number"
        min="0"
        max="59"
        value={minute}
        onChange={handleMinuteChange}
        className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        placeholder="Minute"
      />
    </div>
  );
};