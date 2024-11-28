import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MonitoringSession } from '../../types/monitoring';
import { format, differenceInMinutes, addHours } from 'date-fns';

interface Props {
  sessions: MonitoringSession[];
  onUpdateSession: (sessionId: string, updates: Partial<MonitoringSession>) => void;
}

export const SessionExecutionPage: React.FC<Props> = ({ sessions, onUpdateSession }) => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const session = sessions.find(s => s.id === sessionId);
  
  const [exposures, setExposures] = useState<Array<{
    pointId: string;
    plateId: string;
    startTime?: Date;
    endTime?: Date;
    skipped?: boolean;
    skipReason?: string;
    damaged?: boolean;
    damageReason?: string;
    earlyEndReason?: string;
  }>>([]);

  useEffect(() => {
    if (session?.startDetails?.mediaDetails?.plates?.sample) {
      // Initialize exposures from session data or create new ones
      setExposures(
        session.exposures || 
        session.startDetails.mediaDetails.plates.sample.map(plate => ({
          pointId: plate.pointId,
          plateId: plate.id
        }))
      );
    }
  }, [session]);

  if (!session || !session.startDetails?.mediaDetails) {
    return <div>Session not found or not properly initialized</div>;
  }

  const handleStartExposure = (plateId: string) => {
    const newExposures = exposures.map(exp => 
      exp.plateId === plateId ? { ...exp, startTime: new Date() } : exp
    );
    setExposures(newExposures);
    onUpdateSession(session.id, { 
      exposures: newExposures,
      status: 'in-progress'
    });
  };

  const handleEndExposure = (plateId: string) => {
    const exposure = exposures.find(exp => exp.plateId === plateId);
    if (!exposure?.startTime) return;

    const startTime = new Date(exposure.startTime);
    const minimumEndTime = addHours(startTime, 4);
    const now = new Date();

    if (now < minimumEndTime) {
      alert('Regular exposure end is only allowed after 4 hours. For early end, please use "End Early" option with reason.');
      return;
    }

    const newExposures = exposures.map(exp => 
      exp.plateId === plateId ? { ...exp, endTime: now } : exp
    );
    setExposures(newExposures);
    onUpdateSession(session.id, { exposures: newExposures });
  };

  const handleEndExposureEarly = (plateId: string, reason: string) => {
    if (!reason) return;
    
    const now = new Date();
    const newExposures = exposures.map(exp => 
      exp.plateId === plateId ? { 
        ...exp, 
        endTime: now,
        earlyEndReason: reason
      } : exp
    );
    setExposures(newExposures);
    onUpdateSession(session.id, { exposures: newExposures });
  };

  const handleSkipExposure = (plateId: string, reason: string) => {
    if (!reason) return;

    const newExposures = exposures.map(exp => 
      exp.plateId === plateId ? { ...exp, skipped: true, skipReason: reason } : exp
    );
    setExposures(newExposures);
    onUpdateSession(session.id, { exposures: newExposures });
  };

  const handleReportDamage = (plateId: string, reason: string) => {
    if (!reason) return;

    const newExposures = exposures.map(exp => 
      exp.plateId === plateId ? { ...exp, damaged: true, damageReason: reason } : exp
    );
    setExposures(newExposures);
    onUpdateSession(session.id, { exposures: newExposures });
  };

  const isExposureComplete = exposures.every(exp => 
    exp.endTime || exp.skipped || exp.damaged
  );

  const handleSubmit = () => {
    onUpdateSession(session.id, { 
      exposures,
      status: 'in-progress'
    });
    navigate(`/sessions/${sessionId}/incubation`, { replace: true });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Plate Exposure Tracking</h3>
            <Link
              to={`/sessions/${sessionId}/details`}
              className="text-blue-600 hover:text-blue-900"
            >
              View Details
            </Link>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-700 mb-4">Exposure Progress</h4>
              <div className="space-y-4">
                {exposures.map((exposure, index) => (
                  <div key={exposure.plateId} className="border rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Plate ID: {exposure.plateId}
                        </p>
                        <p className="text-sm text-gray-500">
                          Sampling Point {index + 1}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        {!exposure.startTime && !exposure.skipped && !exposure.damaged && (
                          <>
                            <button
                              onClick={() => handleStartExposure(exposure.plateId)}
                              className="px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
                            >
                              Start Exposure
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt('Please enter reason for skipping:');
                                if (reason) handleSkipExposure(exposure.plateId, reason);
                              }}
                              className="px-3 py-1 text-sm text-gray-600 border rounded hover:bg-gray-50"
                            >
                              Skip
                            </button>
                          </>
                        )}
                        {exposure.startTime && !exposure.endTime && !exposure.damaged && (
                          <>
                            <button
                              onClick={() => handleEndExposure(exposure.plateId)}
                              className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                            >
                              End Exposure
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt('Please enter reason for early end:');
                                if (reason) handleEndExposureEarly(exposure.plateId, reason);
                              }}
                              className="px-3 py-1 text-sm text-yellow-600 border rounded hover:bg-yellow-50"
                            >
                              End Early
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt('Please enter damage details:');
                                if (reason) handleReportDamage(exposure.plateId, reason);
                              }}
                              className="px-3 py-1 text-sm text-red-600 border rounded hover:bg-red-50"
                            >
                              Report Damage
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {exposure.startTime && (
                      <div className="mt-2 text-sm">
                        <p>Started: {format(new Date(exposure.startTime), 'HH:mm:ss')}</p>
                        {exposure.endTime && (
                          <>
                            <p>Ended: {format(new Date(exposure.endTime), 'HH:mm:ss')}</p>
                            <p>Duration: {differenceInMinutes(new Date(exposure.endTime), new Date(exposure.startTime))} minutes</p>
                            {exposure.earlyEndReason && (
                              <p className="text-yellow-600">Early end reason: {exposure.earlyEndReason}</p>
                            )}
                          </>
                        )}
                        {!exposure.endTime && !exposure.damaged && (
                          <p>Time since start: {differenceInMinutes(new Date(), new Date(exposure.startTime))} minutes</p>
                        )}
                      </div>
                    )}

                    {exposure.skipped && (
                      <p className="mt-2 text-sm text-gray-500">
                        Skipped: {exposure.skipReason}
                      </p>
                    )}

                    {exposure.damaged && (
                      <p className="mt-2 text-sm text-red-600">
                        Damaged: {exposure.damageReason}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {isExposureComplete && (
              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Complete & Continue to Incubation
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};