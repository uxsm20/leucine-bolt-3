import React from 'react';
import { format } from 'date-fns';
import { MonitoringSchedule, MonitoringSession } from '../../types/monitoring';

interface Props {
  schedule: MonitoringSchedule;
  sessions: MonitoringSession[];
  onClose: () => void;
}

export const ScheduleDetails: React.FC<Props> = ({ schedule, sessions, onClose }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Schedule Details</h2>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-gray-800"
        >
          Close
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Status</h3>
          <p className="mt-1">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              schedule.status === 'active' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {schedule.status.toUpperCase()}
            </span>
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Monitoring Type</h3>
          <p className="mt-1 text-sm text-gray-900">{schedule.monitoringType.replace('-', ' ').toUpperCase()}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Frequency</h3>
          <p className="mt-1 text-sm text-gray-900">{schedule.frequency.toUpperCase()}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Tolerance</h3>
          <p className="mt-1 text-sm text-gray-900">{schedule.tolerance.value} {schedule.tolerance.unit}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Start Date</h3>
          <p className="mt-1 text-sm text-gray-900">{format(new Date(schedule.startDate), 'PPP')}</p>
        </div>

        {schedule.endDate && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">End Date</h3>
            <p className="mt-1 text-sm text-gray-900">{format(new Date(schedule.endDate), 'PPP')}</p>
          </div>
        )}

        {schedule.nextSession && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Next Session</h3>
            <p className="mt-1 text-sm text-gray-900">{format(new Date(schedule.nextSession), 'PPp')}</p>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">Time Slots</h3>
        <div className="bg-gray-50 rounded-md p-4">
          <ul className="space-y-2">
            {schedule.timeSlots.map((slot, index) => (
              <li key={index} className="text-sm text-gray-900">
                {String(slot.hour).padStart(2, '0')}:{String(slot.minute).padStart(2, '0')}
                {slot.description && ` - ${slot.description}`}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Scheduled Sessions</h3>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sampling Points
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sessions.map((session) => (
                <tr key={session.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(session.scheduledTime), 'PPp')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      session.status === 'completed' ? 'bg-green-100 text-green-800' :
                      session.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {session.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {session.samplingPoints.length} points
                  </td>
                </tr>
              ))}
              {sessions.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                    No sessions scheduled yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};