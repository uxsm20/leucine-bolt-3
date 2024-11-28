import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface Props {
  currentUser: { id: string; name: string; };
  onStartStage2: (incubationSessionId: string, details: any) => void;
}

export const Stage2SetupPage: React.FC<Props> = ({ currentUser, onStartStage2 }) => {
  const { incubationSessionId } = useParams();
  const navigate = useNavigate();
  const [selectedIncubator, setSelectedIncubator] = useState('');
  const [actualTemperature, setActualTemperature] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Demo incubators - in real app, this would come from backend
  const availableIncubators = [
    { id: 'INC-001', name: 'Incubator 1', currentTemp: 22.5, targetTemp: 22.0, status: 'available' },
    { id: 'INC-002', name: 'Incubator 2', currentTemp: 23.0, targetTemp: 22.0, status: 'available' },
    { id: 'INC-003', name: 'Incubator 3', currentTemp: 22.5, targetTemp: 22.0, status: 'available' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedIncubator || !actualTemperature) {
      setError('Please fill in all required fields');
      return;
    }

    const selectedIncubatorDetails = availableIncubators.find(inc => inc.id === selectedIncubator);
    if (!selectedIncubatorDetails) return;

    const stage2Details = {
      stage2StartTime: new Date(),
      stage2Incubator: selectedIncubator,
      stage2InitialTemperature: parseFloat(actualTemperature),
      stage2StartedBy: currentUser.name
    };

    onStartStage2(incubationSessionId!, stage2Details);
    navigate(`/incubation/${incubationSessionId}/monitoring/stage/2`);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow sm:rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Start Stage 2 Incubation (20-25°C)</h2>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Operator</label>
            <p className="mt-1 text-sm text-gray-900">{currentUser.name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Select Incubator</label>
            <select
              value={selectedIncubator}
              onChange={(e) => setSelectedIncubator(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select an incubator</option>
              {availableIncubators
                .filter(inc => inc.currentTemp >= 20 && inc.currentTemp <= 25)
                .map(inc => (
                  <option key={inc.id} value={inc.id}>
                    {inc.name} - Current Temp: {inc.currentTemp}°C
                  </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Only showing incubators suitable for Stage 2 (20-25°C)
            </p>
          </div>

          {selectedIncubator && (
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Incubator Details</h3>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Target Temperature</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {availableIncubators.find(inc => inc.id === selectedIncubator)?.targetTemp}°C
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Current Temperature</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {availableIncubators.find(inc => inc.id === selectedIncubator)?.currentTemp}°C
                  </dd>
                </div>
              </dl>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Actual Temperature at Placement (°C)
            </label>
            <input
              type="number"
              step="0.1"
              value={actualTemperature}
              onChange={(e) => setActualTemperature(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Temperature should be between 20-25°C for Stage 2
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <p className="mt-1 text-sm text-gray-900">{format(new Date(), 'PPp')}</p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/incubation')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Start Stage 2
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};