import React, { useState } from 'react';
import { ScheduleList } from './ScheduleList';
import { ScheduleForm } from './ScheduleForm';
import { ScheduleDetails } from './ScheduleDetails';
import { MonitoringSchedule, MonitoringSession } from '../../types/monitoring';
import { DEMO_AREAS, DEMO_ROOMS, DEMO_POINTS, DEMO_SCHEDULES } from '../../data/demo';
import { createSessionsFromSchedule } from '../../utils/scheduleUtils';

interface Props {
  onScheduledSessions: (sessions: MonitoringSession[]) => void;
  sessions: MonitoringSession[];
}

export const SchedulerPage: React.FC<Props> = ({ onScheduledSessions, sessions }) => {
  const [schedules, setSchedules] = useState<MonitoringSchedule[]>(DEMO_SCHEDULES);
  const [showForm, setShowForm] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<MonitoringSchedule | null>(null);

  const handleCreateSchedule = (scheduleData: Partial<MonitoringSchedule>) => {
    const newSchedule: MonitoringSchedule = {
      id: `SCH-${Date.now()}`,
      ...scheduleData as MonitoringSchedule,
      status: 'active'
    };

    // Create initial sessions
    const initialSessions = createSessionsFromSchedule(newSchedule);
    
    if (initialSessions.length > 0) {
      newSchedule.nextSession = initialSessions[0].scheduledTime;
    }

    // Update schedules and create sessions
    setSchedules(prev => [...prev, newSchedule]);
    onScheduledSessions(initialSessions);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showForm ? (
          <ScheduleForm
            areas={DEMO_AREAS}
            rooms={DEMO_ROOMS}
            samplingPoints={DEMO_POINTS}
            onSubmit={handleCreateSchedule}
            onCancel={() => setShowForm(false)}
          />
        ) : selectedSchedule ? (
          <ScheduleDetails
            schedule={selectedSchedule}
            onClose={() => setSelectedSchedule(null)}
            sessions={sessions.filter(s => s.scheduleId === selectedSchedule.id)}
          />
        ) : (
          <ScheduleList
            schedules={schedules}
            onCreateNew={() => setShowForm(true)}
            onSelectSchedule={setSelectedSchedule}
          />
        )}
      </div>
    </div>
  );
};