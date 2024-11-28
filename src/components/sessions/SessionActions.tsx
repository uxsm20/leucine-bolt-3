import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MonitoringSession } from '../../types/monitoring';

interface Props {
  session: MonitoringSession;
}

export const SessionActions: React.FC<Props> = ({ session }) => {
  const navigate = useNavigate();

  const handleVerifyMedia = () => {
    navigate(`/sessions/${session.id}/verify-media`);
  };

  return (
    <div className="space-x-2">
      <button
        onClick={handleVerifyMedia}
        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
      >
        Verify Media Lot
      </button>
    </div>
  );
};