import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format, differenceInHours } from 'date-fns';

interface Props {
  currentUser: { id: string; name: string; };
  onUpdateIncubation: (incubationSessionId: string, details: any) => void;
}

export const IncubationMonitoringPage: React.FC<Props> = ({ currentUser, onUpdateIncubation }) => {
  const { incubationSessionId, stage } = useParams();
  const navigate = useNavigate();
  const [temperatureReadings, setTemperatureReadings] = useState<Array<{
    time: Date;
    temperature: number;
    recordedBy: string;
    comments?: string;
  }>>([]);
  const [incubatorChanges, setIncubatorChanges] = useState<Array<{
    time: Date;
    fromIncubator: string;
    toIncubator: string;
    reason: string;
    changedBy: string;
  }>>([]);
  const [newTemperature, setNewTemperature] = useState('');
  const [newComments, setNewComments] = useState('');

  const currentStageData = {
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 26),
    currentIncubator: 'INC-001',
    currentTemperature: 32.5,
    stage: parseInt(stage || '1'),
    requirements: stage === '1' 
      ? { tempRange: '30-35°C', duration: '24-48 hours' }
      : { tempRange: '20-25°C', duration: '24-48 hours' }
  };

  const handleAddReading = () => {
    if (!newTemperature) return;

    setTemperatureReadings([
      ...temperatureReadings,
      {
        time: new Date(),
        temperature: parseFloat(newTemperature),
        recordedBy: currentUser.name,
        comments: newComments || undefined
      }
    ]);

    setNewTemperature('');
    setNewComments('');
  };

  const handleChangeIncubator = () => {
    const reason = prompt('Please enter reason for changing incubator:');
    if (!reason) return;

    const newIncubator = prompt('Enter new incubator ID:');
    if (!newIncubator) return;

    setIncubatorChanges([
      ...incubatorChanges,
      {
        time: new Date(),
        fromIncubator: currentStageData.currentIncubator,
        toIncubator: newIncubator,
        reason,
        changedBy: currentUser.name
      }
    ]);
  };

  const handleEndStage = () => {
    const now = new Date();
    
    if (stage === '1') {
      onUpdateIncubation(incubationSessionId!, {
        stage1CompletionTime: now,
        stage1CompletedBy: currentUser.name,
        stage1Readings: temperatureReadings,
        stage1IncubatorChanges: incubatorChanges,
        currentStage: 2,
        status: 'stage1-completed'
      });
    } else {
      onUpdateIncubation(incubationSessionId!, {
        stage2CompletionTime: now,
        stage2CompletedBy: currentUser.name,
        stage2Readings: temperatureReadings,
        stage2IncubatorChanges: incubatorChanges,
        currentStage: 2,
        status: 'completed'
      });
    }
    
    // Use replace to prevent going back to this page
    navigate('/incubation', { replace: true });
  };

  const hoursElapsed = differenceInHours(new Date(), currentStageData.startTime);
  const canEndStage = hoursElapsed >= 24;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow sm:rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">
            Incubation Monitoring - Stage {stage}
          </h2>
          <span className={`px-2 py-1 text-sm rounded-full ${
            stage === '1' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
          }`}>
            {stage === '1' ? 'First Stage (30-35°C)' : 'Second Stage (20-25°C)'}
          </span>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Stage Requirements</h3>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Temperature Range</dt>
                <dd className="mt-1 text-sm text-gray-900">{currentStageData.requirements.tempRange}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Duration</dt>
                <dd className="mt-1 text-sm text-gray-900">{currentStageData.requirements.duration}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Start Time</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {format(currentStageData.startTime, 'PPp')}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Time Elapsed</dt>
                <dd className="mt-1 text-sm text-gray-900">{hoursElapsed} hours</dd>
              </div>
            </dl>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-700">Current Incubator</h3>
              <button
                onClick={handleChangeIncubator}
                className="text-blue-600 hover:text-blue-900 text-sm"
              >
                Change Incubator
              </button>
            </div>
            <div className="bg-white border rounded-md p-4">
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Incubator ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{currentStageData.currentIncubator}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Current Temperature</dt>
                  <dd className="mt-1 text-sm text-gray-900">{currentStageData.currentTemperature}°C</dd>
                </div>
              </dl>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-4">Add Temperature Reading</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Temperature (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newTemperature}
                  onChange={(e) => setNewTemperature(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Comments (Optional)</label>
                <input
                  type="text"
                  value={newComments}
                  onChange={(e) => setNewComments(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              onClick={handleAddReading}
              disabled={!newTemperature}
              className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              Add Reading
            </button>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-4">Temperature Readings</h3>
            <div className="bg-white border rounded-md">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Temperature</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recorded By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comments</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {temperatureReadings.map((reading, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(reading.time, 'PPp')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {reading.temperature}°C
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {reading.recordedBy}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {reading.comments || '-'}
                      </td>
                    </tr>
                  ))}
                  {temperatureReadings.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                        No readings recorded yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Link
              to="/incubation"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </Link>
            {canEndStage && (
              <button
                onClick={handleEndStage}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                End Stage {stage}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};