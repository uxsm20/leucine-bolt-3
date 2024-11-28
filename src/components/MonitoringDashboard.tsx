import React, { useState } from 'react';
import { format } from 'date-fns';
import { MonitoringSession } from '../types/monitoring';
import { TrendingGraphs } from './dashboard/TrendingGraphs';

interface Props {
  sessions: MonitoringSession[];
}

export const MonitoringDashboard: React.FC<Props> = ({ sessions }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [activityStatus, setActivityStatus] = useState<'production-ongoing' | 'idle' | ''>('');

  const inProgressSessions = sessions.filter(session => session.status === 'in-progress').length;
  const completedToday = sessions.filter(session => 
    session.status === 'completed' && 
    format(new Date(session.scheduledTime), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  ).length;
  const pendingSessions = sessions.filter(session => session.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Monitoring Dashboard</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">In Progress</h3>
          <p className="text-3xl font-bold text-blue-600">{inProgressSessions}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Completed Today</h3>
          <p className="text-3xl font-bold text-green-600">{completedToday}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">{pendingSessions}</p>
        </div>
      </div>

      <TrendingGraphs 
        timeRange={timeRange}
        selectedArea={selectedArea}
        activityStatus={activityStatus as 'production-ongoing' | 'idle'}
        onTimeRangeChange={setTimeRange}
        onAreaChange={setSelectedArea}
        onActivityStatusChange={setActivityStatus}
      />

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Sessions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scheduled Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Area
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sessions.slice(0, 5).map((session) => (
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
                    Sterile Manufacturing
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {session.activityStatus?.type === 'production-ongoing' ? 'Production' : 'Idle'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};