import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MonitoringSession } from '../../types/monitoring';

interface Props {
  sessions: MonitoringSession[];
  onCreateBatch: (sessionIds: string[]) => string;
}

export const CreateIncubationBatch: React.FC<Props> = ({ sessions, onCreateBatch }) => {
  const navigate = useNavigate();
  const [mediaType, setMediaType] = useState<'TSA' | 'SDA'>('TSA');
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);

  // Get sessions with plates ready for incubation for selected media type
  const availableSessions = sessions.filter(session => {
    const hasCompletedExposures = session.exposures?.some(exp => 
      (exp.endTime || exp.earlyEndReason) && !exp.skipped && !exp.damaged
    );
    const hasNegativeControls = session.startDetails?.mediaDetails?.plates?.negativeControl?.length ?? 0 > 0;
    const notStartedIncubation = !session.incubation;
    const matchesMediaType = session.startDetails?.mediaDetails?.lotNumber?.startsWith(mediaType);
    
    return hasCompletedExposures && hasNegativeControls && notStartedIncubation && matchesMediaType;
  });

  const handleSubmit = () => {
    if (selectedSessions.length === 0) return;
    
    // Create the batch and get its ID
    const batchId = onCreateBatch(selectedSessions);
    
    // Navigate to incubator assignment page with the new batch ID
    navigate(`/incubation/${batchId}/assign-incubator`);
  };

  const getIncubationConditions = (type: 'TSA' | 'SDA') => {
    return type === 'TSA' 
      ? { temp: '30-35°C', duration: '48-72 hours' }
      : { temp: '20-25°C', duration: '5-7 days' };
  };

  const conditions = getIncubationConditions(mediaType);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow sm:rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Create New Incubation Batch</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Media Type</label>
            <select
              value={mediaType}
              onChange={(e) => {
                setMediaType(e.target.value as 'TSA' | 'SDA');
                setSelectedSessions([]);
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="TSA">Tryptic Soy Agar (TSA)</option>
              <option value="SDA">Sabouraud Dextrose Agar (SDA)</option>
            </select>
          </div>

          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Incubation Conditions</h3>
            <ul className="text-sm text-blue-700">
              <li>Temperature Range: {conditions.temp}</li>
              <li>Duration: {conditions.duration}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-4">Select Sessions</h3>
            <div className="bg-white border rounded-md divide-y max-h-96 overflow-y-auto">
              {availableSessions.map(session => {
                const completedPlates = session.exposures?.filter(exp => 
                  (exp.endTime || exp.earlyEndReason) && !exp.skipped && !exp.damaged
                ).length || 0;
                const negativeControls = session.startDetails?.mediaDetails?.plates?.negativeControl?.length || 0;

                return (
                  <div key={session.id} className="p-4">
                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedSessions.includes(session.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSessions([...selectedSessions, session.id]);
                          } else {
                            setSelectedSessions(selectedSessions.filter(id => id !== session.id));
                          }
                        }}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Session: {new Date(session.scheduledTime).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          Media Lot: {session.startDetails?.mediaDetails?.lotNumber}
                        </p>
                        <p className="text-sm text-gray-500">
                          Plates: {completedPlates} sample + {negativeControls} negative control
                        </p>
                      </div>
                    </label>
                  </div>
                );
              })}
              {availableSessions.length === 0 && (
                <div className="p-4 text-sm text-gray-500">
                  No sessions available for incubation with selected media type
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/incubation')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={selectedSessions.length === 0}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              Create Batch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};