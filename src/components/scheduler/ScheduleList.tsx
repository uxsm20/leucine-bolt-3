import React from 'react';
import { format } from 'date-fns';
import { MonitoringSchedule } from '../../types/monitoring';

interface Props {
  schedules: MonitoringSchedule[];
  onSelectSchedule: (scheduleId: string) => void;
}

export const ScheduleList: React.FC<Props> = ({ schedules, onSelectSchedule }) => {
  return (
    <div className="space-y-4">
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {schedules.map((schedule) => (
            <li 
              key={schedule.id} 
              className="px-6 py-4 hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {schedule.monitoringType.replace('-', ' ').toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Frequency: {schedule.frequency} | Tolerance: {schedule.tolerance.value} {schedule.tolerance.unit}
                  </p>
                  <p className="text-sm text-gray-500">
                    Start Date: {format(new Date(schedule.startDate), 'PPP')}
                  </p>
                  {schedule.nextSession && (
                    <p className="text-sm text-gray-500">
                      Next Session: {format(new Date(schedule.nextSession), 'PPp')}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    schedule.status === 'active' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {schedule.status.toUpperCase()}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectSchedule(schedule.id);
                    }}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </li>
          ))}
          {schedules.length === 0 && (
            <li className="px-6 py-4 text-center text-gray-500">
              No schedules created yet
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};