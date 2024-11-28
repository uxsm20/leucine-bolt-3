import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface Props {
  currentUser: { id: string; name: string; };
  onAssignIncubator: (incubationSessionId: string, assignmentDetails: {
    incubatorId: string;
    targetTemperature: number;
    actualTemperature: number;
    placementTime: Date;
    placedBy: string;
  }) => void;
}

export const IncubatorAssignmentPage: React.FC<Props> = ({ currentUser, onAssignIncubator }) => {
  const { incubationSessionId } = useParams();
  const navigate = useNavigate();

  const [selectedIncubator, setSelectedIncubator] = useState('');
  const [actualTemperature, setActualTemperature] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Demo incubators - in real app, this would come from backend
  const availableIncubators = [
    { id: 'INC-001', name: 'Incubator 1', currentTemp: 32.5, targetTemp: 32.0, status: 'available' },
    { id: 'INC-002', name: 'Incubator 2', currentTemp: 33.0, targetTemp: 32.0, status: 'available' },
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

    const assignmentDetails = {
      incubatorId: selectedIncubator,
      targetTemperature: selectedIncubatorDetails.targetTemp,
      actualTemperature: parseFloat(actualTemperature),
      placementTime: new Date(),
      placedBy: currentUser.name
    };

    onAssignIncubator(incubationSessionId!, assignmentDetails);

    // Navigate to monitoring page with stage 1
    navigate(`/incubation/${incubationSessionId}/monitoring/stage/1`);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow sm:rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Assign Incubator - Stage 1 (30-35°C)</h2>

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
                .filter(inc => inc.currentTemp >= 30 && inc.currentTemp <= 35)
                .map(inc => (
                  <option key={inc.id} value={inc.id}>
                    {inc.name} - Current Temp: {inc.currentTemp}°C
                  </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Only showing incubators suitable for Stage 1 (30-35°C)
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
              Temperature should be between 30-35°C for Stage 1
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Placement Time</label>
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
              Start Stage 1 Incubation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};