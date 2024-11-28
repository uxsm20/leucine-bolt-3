import React from 'react';
import { useParams } from 'react-router-dom';
import { MonitoringSession } from '../../types/monitoring';
import { format } from 'date-fns';
import { DEMO_MEDIA_LOTS } from '../../data/demo';

interface Props {
  sessions: MonitoringSession[];
}

export const SessionDetailsPage: React.FC<Props> = ({ sessions }) => {
  const { sessionId } = useParams();
  const session = sessions.find(s => s.id === sessionId);

  if (!session) {
    return <div>Session not found</div>;
  }

  const mediaLot = session.startDetails?.mediaDetails?.lotNumber 
    ? DEMO_MEDIA_LOTS.find(lot => lot.lotNumber === session.startDetails?.mediaDetails.lotNumber)
    : null;

  // Calculate plates ready for incubation
  const readyForIncubationPlates = session.exposures?.filter(exposure => 
    (exposure.endTime || exposure.earlyEndReason) && !exposure.skipped && !exposure.damaged
  ).length || 0;

  const negativeControlPlates = session.startDetails?.mediaDetails?.plates?.negativeControl?.length || 0;
  const totalReadyPlates = readyForIncubationPlates + negativeControlPlates;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-xl font-semibold mb-6">Session Details</h2>

          <div className="space-y-8">
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Scheduled Time</dt>
                  <dd className="text-sm text-gray-900">
                    {format(new Date(session.scheduledTime), 'PPp')}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      session.status === 'completed' ? 'bg-green-100 text-green-800' :
                      session.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {session.status.toUpperCase()}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Activity Status</dt>
                  <dd className="text-sm text-gray-900">
                    {session.activityStatus.type === 'production-ongoing' ? 'Production Ongoing' : 'Idle'}
                  </dd>
                </div>
                {session.activityStatus.type === 'production-ongoing' && session.batchDetails && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Batch Details</dt>
                    <dd className="text-sm text-gray-900">
                      Batch: {session.batchDetails.batchId}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Media Verification Step */}
            {session.startDetails?.mediaDetails && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Media Verification</h3>
                <dl className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Media Lot</dt>
                    <dd className="text-sm text-gray-900">{session.startDetails.mediaDetails.lotNumber}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Media Type</dt>
                    <dd className="text-sm text-gray-900">{mediaLot?.type}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Required Plates</dt>
                    <dd className="text-sm text-gray-900">{session.startDetails.mediaDetails.numberOfPlates}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Negative Control Plates</dt>
                    <dd className="text-sm text-gray-900">{session.startDetails.mediaDetails.negativeControlPlates}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Verification Time</dt>
                    <dd className="text-sm text-gray-900">
                      {format(new Date(session.startDetails.actualStartTime), 'PPp')}
                    </dd>
                  </div>
                </dl>
              </div>
            )}

            {/* Negative Control Storage Step */}
            {session.negativeControlStorage && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Negative Control Storage</h3>
                <dl className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Storage Location</dt>
                    <dd className="text-sm text-gray-900">{session.negativeControlStorage.storageLocation}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Temperature</dt>
                    <dd className="text-sm text-gray-900">{session.negativeControlStorage.temperature}°C</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Stored By</dt>
                    <dd className="text-sm text-gray-900">{session.negativeControlStorage.storedBy}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Storage Time</dt>
                    <dd className="text-sm text-gray-900">
                      {format(new Date(session.negativeControlStorage.storageTime), 'PPp')}
                    </dd>
                  </div>
                  {session.negativeControlStorage.endTime && (
                    <>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Storage End Time</dt>
                        <dd className="text-sm text-gray-900">
                          {format(new Date(session.negativeControlStorage.endTime), 'PPp')}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Storage Duration</dt>
                        <dd className="text-sm text-gray-900">
                          {Math.round((new Date(session.negativeControlStorage.endTime).getTime() - 
                            new Date(session.negativeControlStorage.storageTime).getTime()) / (1000 * 60))} minutes
                        </dd>
                      </div>
                    </>
                  )}
                </dl>
              </div>
            )}

            {/* Exposure Step */}
            {session.exposures && session.exposures.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Plate Exposures</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="text-left text-sm font-medium text-gray-500">Plate ID</th>
                        <th className="text-left text-sm font-medium text-gray-500">Start Time</th>
                        <th className="text-left text-sm font-medium text-gray-500">End Time</th>
                        <th className="text-left text-sm font-medium text-gray-500">Status</th>
                        <th className="text-left text-sm font-medium text-gray-500">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {session.exposures.map((exposure, index) => (
                        <tr key={index}>
                          <td className="text-sm text-gray-900">{exposure.plateId}</td>
                          <td className="text-sm text-gray-900">
                            {exposure.startTime ? format(new Date(exposure.startTime), 'PPp') : '-'}
                          </td>
                          <td className="text-sm text-gray-900">
                            {exposure.endTime ? format(new Date(exposure.endTime), 'PPp') : '-'}
                          </td>
                          <td className="text-sm text-gray-900">
                            {exposure.damaged ? 'Damaged' : 
                             exposure.skipped ? 'Skipped' :
                             exposure.endTime ? 'Completed' :
                             exposure.startTime ? 'In Progress' : 'Pending'}
                          </td>
                          <td className="text-sm text-gray-900">
                            {exposure.earlyEndReason && <span className="text-yellow-600">Early End: {exposure.earlyEndReason}</span>}
                            {exposure.skipReason && <span className="text-gray-600">Skip Reason: {exposure.skipReason}</span>}
                            {exposure.damageReason && <span className="text-red-600">Damage: {exposure.damageReason}</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Ready for Incubation Summary */}
            {session.exposures && !session.incubation && totalReadyPlates > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ready for Incubation</h3>
                <dl className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Sample Plates Ready</dt>
                    <dd className="text-sm text-gray-900">{readyForIncubationPlates}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Negative Control Plates</dt>
                    <dd className="text-sm text-gray-900">{negativeControlPlates}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Total Plates</dt>
                    <dd className="text-sm text-gray-900">{totalReadyPlates}</dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};