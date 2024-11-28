import React from 'react';
import { Link } from 'react-router-dom';
import { MonitoringSession } from '../../types/monitoring';
import { format } from 'date-fns';

interface Props {
  sessions: MonitoringSession[];
}

export const SessionsList: React.FC<Props> = ({ sessions }) => {
  const getNextActionLink = (session: MonitoringSession) => {
    // If session hasn't started yet
    if (session.status === 'pending') {
      return {
        to: `/sessions/${session.id}/verify-media`,
        text: 'Start Session'
      };
    }

    // If media verification is done but negative control storage isn't
    if (session.startDetails && !session.negativeControlStorage) {
      return {
        to: `/sessions/${session.id}/store-controls`,
        text: 'Store Negative Controls'
      };
    }

    // If negative control storage is done but exposures aren't complete
    if (session.negativeControlStorage && (!session.exposures || session.exposures.length === 0)) {
      return {
        to: `/sessions/${session.id}/execute`,
        text: 'Start Exposures'
      };
    }

    // If exposures are complete but not all plates are processed
    if (session.exposures && !session.incubation) {
      const allExposuresComplete = session.exposures.every(exp => 
        exp.endTime || exp.skipped || exp.damaged
      );
      if (allExposuresComplete) {
        return {
          to: `/sessions/${session.id}/incubation`,
          text: 'Ready for Incubation'
        };
      } else {
        return {
          to: `/sessions/${session.id}/execute`,
          text: 'Continue Exposures'
        };
      }
    }

    return null;
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
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
              Sampling Points
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sessions.map((session) => {
            const nextAction = getNextActionLink(session);
            
            return (
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
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="space-x-4">
                    <Link
                      to={`/sessions/${session.id}/details`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Details
                    </Link>
                    {nextAction && (
                      <Link
                        to={nextAction.to}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        {nextAction.text}
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
          {sessions.length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                No sessions found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};