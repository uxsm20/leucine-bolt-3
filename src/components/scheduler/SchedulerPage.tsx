import React, { useState, useCallback } from 'react';
import { ScheduleList } from './ScheduleList';
import { ScheduleForm } from './ScheduleForm';
import { ScheduleDetails } from './ScheduleDetails';
import { MonitoringSchedule, MonitoringSession } from '../../types/monitoring';
import { DEMO_ROOMS, DEMO_POINTS, DEMO_AREAS, DEMO_SCHEDULES } from '../../data/demo';

interface Props {
  sessions: MonitoringSession[];
}

export const SchedulerPage: React.FC<Props> = ({ sessions }) => {
  const [schedules, setSchedules] = useState(DEMO_SCHEDULES);
  const [showForm, setShowForm] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);

  console.log('Current State:', { showForm, selectedSchedule }); // Debug log

  const handleCreateSchedule = useCallback((schedule: MonitoringSchedule) => {
    setSchedules(prev => [...prev, schedule]);
    setShowForm(false);
  }, []);

  const handleCreateNew = useCallback(() => {
    console.log('Create New clicked'); // Debug log
    setShowForm(true);
    setSelectedSchedule(null);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedSchedule(null);
  }, []);

  const handleCancel = useCallback(() => {
    setShowForm(false);
  }, []);

  const handleSelectSchedule = useCallback((scheduleId: string) => {
    setShowForm(false);
    setSelectedSchedule(scheduleId);
  }, []);

  const MainContent = () => {
    console.log('Rendering MainContent:', { showForm, selectedSchedule }); // Debug log

    if (showForm) {
      return (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <ScheduleForm
              areas={DEMO_AREAS}
              rooms={DEMO_ROOMS}
              samplingPoints={DEMO_POINTS}
              onSubmit={handleCreateSchedule}
              onCancel={handleCancel}
            />
          </div>
        </div>
      );
    }

    if (selectedSchedule) {
      const schedule = schedules.find(s => s.id === selectedSchedule);
      if (!schedule) {
        console.log('Schedule not found:', selectedSchedule); // Debug log
        return null;
      }
      return (
        <ScheduleDetails
          schedule={schedule}
          sessions={sessions.filter(s => s.scheduleId === selectedSchedule)}
          onClose={handleClose}
        />
      );
    }

    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ScheduleList
          schedules={schedules}
          onSelectSchedule={handleSelectSchedule}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {showForm ? 'Create New Schedule' : selectedSchedule ? 'Schedule Details' : 'Monitoring Schedules'}
            </h2>
          </div>
          {!showForm && !selectedSchedule && (
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <button
                type="button"
                onClick={() => {
                  console.log('Button clicked'); // Debug log
                  handleCreateNew();
                }}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create New Schedule
              </button>
            </div>
          )}
        </div>

        <div className="mt-8">
          <MainContent />
        </div>
      </div>
    </div>
  );
};