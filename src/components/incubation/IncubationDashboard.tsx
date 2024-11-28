import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MonitoringSession } from '../../types/monitoring';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { OngoingIncubationsList } from './OngoingIncubationsList';
import { DEMO_INCUBATION_BATCHES } from '../../data/demo';

interface Props {
  sessions: MonitoringSession[];
  onToggleSidebar: () => void;
}

export const IncubationDashboard: React.FC<Props> = ({ sessions, onToggleSidebar }) => {
  const [selectedMediaType, setSelectedMediaType] = useState<'TSA' | 'SDA'>('TSA');
  const [batches, setBatches] = useState(DEMO_INCUBATION_BATCHES);

  // Get sessions with plates ready for incubation
  const readyForIncubationSessions = sessions.filter(session => {
    const hasCompletedExposures = session.exposures?.some(exp => 
      (exp.endTime || exp.earlyEndReason) && !exp.skipped && !exp.damaged
    );
    const hasNegativeControls = session.startDetails?.mediaDetails?.plates?.negativeControl?.length ?? 0 > 0;
    const notStartedIncubation = !session.incubation;
    const matchesMediaType = session.startDetails?.mediaDetails?.lotNumber?.startsWith(selectedMediaType);
    
    return hasCompletedExposures && hasNegativeControls && notStartedIncubation && matchesMediaType;
  });

  const handleEndIncubation = (batchId: string) => {
    setBatches(prev => prev.filter(batch => batch.id !== batchId));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <Bars3Icon className="h-6 w-6 text-gray-600" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Incubation Dashboard</h2>
        </div>
        <Link
          to="/incubation/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Create New Batch
        </Link>
      </div>

      {/* Ongoing Incubations */}
      <OngoingIncubationsList 
        batches={batches}
        onEndIncubation={handleEndIncubation}
      />

      {/* Ready for Incubation */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Media Type</label>
          <select
            value={selectedMediaType}
            onChange={(e) => setSelectedMediaType(e.target.value as 'TSA' | 'SDA')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="TSA">Tryptic Soy Agar (TSA)</option>
            <option value="SDA">Sabouraud Dextrose Agar (SDA)</option>
          </select>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Ready for Incubation</h3>
          <div className="bg-white border rounded-md divide-y">
            {readyForIncubationSessions.map((session) => {
              const completedPlates = session.exposures?.filter(exp => 
                (exp.endTime || exp.earlyEndReason) && !exp.skipped && !exp.damaged
              ).length || 0;
              const negativeControls = session.startDetails?.mediaDetails?.plates?.negativeControl?.length || 0;

              return (
                <div key={session.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
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
                    <Link
                      to={`/sessions/${session.id}/incubation`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
            {readyForIncubationSessions.length === 0 && (
              <div className="p-4 text-sm text-gray-500">
                No sessions ready for incubation
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};