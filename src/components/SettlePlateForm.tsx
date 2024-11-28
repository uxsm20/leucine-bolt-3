import React, { useState } from 'react';
import { Room } from '../types/monitoring';

interface Props {
  location: Room;
  onSubmit: (data: any) => void;
}

export const SettlePlateForm: React.FC<Props> = ({ location, onSubmit }) => {
  const [exposureStartTime, setExposureStartTime] = useState('');
  const [collectedBy, setCollectedBy] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      locationId: location.id,
      exposureStartTime: new Date(exposureStartTime),
      collectedBy,
      status: 'active'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Exposure Start Time</label>
        <input
          type="datetime-local"
          value={exposureStartTime}
          onChange={(e) => setExposureStartTime(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Collected By</label>
        <input
          type="text"
          value={collectedBy}
          onChange={(e) => setCollectedBy(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Start Monitoring
      </button>
    </form>
  );
}