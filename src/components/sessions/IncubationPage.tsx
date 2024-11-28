import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MonitoringSession } from '../../types/monitoring';
import { format } from 'date-fns';

interface Props {
  sessions: MonitoringSession[];
  onStartIncubation: (sessionId: string, incubationDetails: {
    startTime: Date;
    plates: {
      id: string;
      type: 'sample' | 'negative-control';
    }[];
  }) => void;
}

export const IncubationPage: React.FC<Props> = ({ sessions, onStartIncubation }) => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const session = sessions.find(s => s.id === sessionId);

  if (!session || !session.startDetails?.mediaDetails) {
    return <div>Session not found or not properly initialized</div>;
  }

  // Get all completed sample plates (including early ended, excluding only skipped and damaged)
  const completedSamplePlates = session.startDetails.mediaDetails.plates?.sample.filter(plate => {
    const exposure = session.exposures?.find(exp => exp.plateId === plate.id);
    // Include plates with endTime (both normal and early ended)
    return exposure?.endTime && !exposure.skipped && !exposure.damaged;
  }) || [];

  // Get all negative control plates
  const negativeControlPlates = session.startDetails.mediaDetails.plates?.negativeControl || [];

  const totalPlatesForIncubation = completedSamplePlates.length + negativeControlPlates.length;

  const handleReadyForIncubation = () => {
    const incubationDetails = {
      startTime: new Date(),
      plates: [
        ...completedSamplePlates.map(plate => ({
          id: plate.id,
          type: 'sample' as const
        })),
        ...negativeControlPlates.map(plate => ({
          id: plate.id,
          type: 'negative-control' as const
        }))
      ]
    };

    onStartIncubation(session.id, incubationDetails);
    navigate(`/sessions/${session.id}/details`);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow sm:rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Ready for Incubation</h2>

        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Plates Summary</h3>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Sample Plates</dt>
                <dd className="mt-1 text-sm text-gray-900">{completedSamplePlates.length}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Negative Control Plates</dt>
                <dd className="mt-1 text-sm text-gray-900">{negativeControlPlates.length}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Total Plates</dt>
                <dd className="mt-1 text-sm text-gray-900">{totalPlatesForIncubation}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Sample Plates</h3>
            <div className="bg-white border rounded-md divide-y">
              {completedSamplePlates.map(plate => {
                const exposure = session.exposures?.find(exp => exp.plateId === plate.id);
                return (
                  <div key={plate.id} className="p-4">
                    <p className="text-sm font-medium text-gray-900">Plate ID: {plate.id}</p>
                    {exposure && (
                      <div className="mt-1 text-sm text-gray-500">
                        <p>Exposure Duration: {
                          exposure.endTime && exposure.startTime ? 
                            `${Math.round((new Date(exposure.endTime).getTime() - 
                              new Date(exposure.startTime).getTime()) / (1000 * 60))} minutes` : 
                            'N/A'
                        }</p>
                        {exposure.earlyEndReason && (
                          <p className="text-yellow-600">Early End: {exposure.earlyEndReason}</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              {completedSamplePlates.length === 0 && (
                <div className="p-4 text-sm text-gray-500">
                  No sample plates ready for incubation
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Negative Control Plates</h3>
            <div className="bg-white border rounded-md divide-y">
              {negativeControlPlates.map(plate => (
                <div key={plate.id} className="p-4">
                  <p className="text-sm font-medium text-gray-900">Plate ID: {plate.id}</p>
                </div>
              ))}
              {negativeControlPlates.length === 0 && (
                <div className="p-4 text-sm text-gray-500">
                  No negative control plates available
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(`/sessions/${session.id}/details`)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleReadyForIncubation}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              disabled={totalPlatesForIncubation === 0}
            >
              Ready for Incubation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};