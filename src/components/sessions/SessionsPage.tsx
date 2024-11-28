import React, { useState } from 'react';
import { MonitoringSession, ProductionArea, Room, SamplingPoint, SessionStartDetails } from '../../types/monitoring';
import { SessionForm } from './SessionForm';
import { SessionsList } from './SessionsList';
import { DEMO_AREAS, DEMO_ROOMS, DEMO_POINTS } from '../../data/demo';

interface Props {
  areas?: ProductionArea[];
  rooms?: Room[];
  samplingPoints?: SamplingPoint[];
  sessions: MonitoringSession[];
  onCreateSession: (session: Partial<MonitoringSession>) => void;
  onStartSession: (sessionId: string, startDetails: SessionStartDetails) => void;
}

export const SessionsPage: React.FC<Props> = ({
  areas = DEMO_AREAS,
  rooms = DEMO_ROOMS,
  samplingPoints = DEMO_POINTS,
  sessions,
  onCreateSession,
  onStartSession,
}) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Monitoring Sessions</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Create Manual Session
        </button>
      </div>

      {showForm ? (
        <SessionForm
          areas={areas}
          rooms={rooms}
          samplingPoints={samplingPoints}
          onSubmit={(data) => {
            onCreateSession({
              ...data,
              id: `SESSION-${Date.now()}`,
              status: 'pending',
              plates: []
            });
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <SessionsList 
          sessions={sessions}
        />
      )}
    </div>
  );
};