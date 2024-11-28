import React, { useState } from 'react';
import { MonitoringSession, ProductionArea } from '../../types/monitoring';
import { SessionForm } from './SessionForm';
import { SessionsList } from './SessionsList';
import { DEMO_ROOMS, DEMO_POINTS, DEMO_AREAS } from '../../data/demo';

interface Props {
  sessions: MonitoringSession[];
  onCreateSession: (sessionData: Partial<MonitoringSession>) => void;
}

export const SessionsPage: React.FC<Props> = ({
  sessions,
  onCreateSession,
}) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Monitoring Sessions
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              onClick={() => setShowForm(true)}
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Manual Session
            </button>
          </div>
        </div>

        <div className="mt-8">
          {showForm ? (
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <SessionForm
                  areas={DEMO_AREAS}
                  rooms={DEMO_ROOMS}
                  samplingPoints={DEMO_POINTS}
                  onSubmit={(data) => {
                    onCreateSession({
                      ...data,
                      id: `SESSION-${Date.now()}`,
                      status: 'pending',
                      activityStatus: { type: 'idle' },
                      plates: []
                    });
                    setShowForm(false);
                  }}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            </div>
          ) : (
            <SessionsList sessions={sessions} />
          )}
        </div>
      </div>
    </div>
  );
};