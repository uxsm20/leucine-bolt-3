import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MonitoringSession } from '../../types/monitoring';

interface Props {
  sessions: MonitoringSession[];
  onStorageComplete: (sessionId: string, storageDetails: {
    storageTime: Date;
    endTime?: Date;
    storageLocation: string;
    storedBy: string;
    temperature: number;
  }) => void;
}

export const NegativeControlStoragePage: React.FC<Props> = ({ sessions, onStorageComplete }) => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const session = sessions.find(s => s.id === sessionId);

  const [storageLocation, setStorageLocation] = useState('');
  const [storedBy, setStoredBy] = useState('');
  const [temperature, setTemperature] = useState('20');
  const [error, setError] = useState<string | null>(null);

  if (!session || !session.startDetails?.mediaDetails) {
    return <div>Session not found or media details missing</div>;
  }

  const handleStartStorage = () => {
    if (!storageLocation || !storedBy || !temperature) {
      setError('Please fill in all required fields');
      return;
    }

    setError(null);

    // Save storage details
    onStorageComplete(session.id, {
      storageTime: new Date(),
      storageLocation,
      storedBy,
      temperature: parseFloat(temperature)
    });

    // Navigate to execute page
    navigate(`/sessions/${session.id}/execute`, { replace: true });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow sm:rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Store Negative Control Plates</h2>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Number of Negative Control Plates
            </label>
            <p className="mt-1 text-sm text-gray-500">
              {session.startDetails.mediaDetails.negativeControlPlates} plates to be stored
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Storage Location</label>
            <select
              value={storageLocation}
              onChange={(e) => setStorageLocation(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select Storage Location</option>
              <option value="sterile-incubator-1">Sterile Incubator 1</option>
              <option value="sterile-incubator-2">Sterile Incubator 2</option>
              <option value="sterile-cabinet-1">Sterile Storage Cabinet 1</option>
              <option value="sterile-cabinet-2">Sterile Storage Cabinet 2</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Storage Temperature (°C)</label>
            <input
              type="number"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Recommended: 20-25°C for TSA, 20-30°C for SDA
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Stored By</label>
            <input
              type="text"
              value={storedBy}
              onChange={(e) => setStoredBy(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              placeholder="Enter operator name"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/sessions')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleStartStorage}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Store & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};