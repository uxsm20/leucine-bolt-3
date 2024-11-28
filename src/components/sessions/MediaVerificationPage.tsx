import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MonitoringSession, SessionStartDetails } from '../../types/monitoring';
import { DEMO_MEDIA_LOTS } from '../../data/demo';

interface Props {
  sessions: MonitoringSession[];
  onStartSession: (sessionId: string, startDetails: SessionStartDetails) => void;
}

export const MediaVerificationPage: React.FC<Props> = ({ sessions, onStartSession }) => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const session = sessions.find(s => s.id === sessionId);

  const [selectedLot, setSelectedLot] = useState('');
  const [negativeControlPlates, setNegativeControlPlates] = useState('');

  if (!session) {
    return <div>Session not found</div>;
  }

  // Filter valid media lots
  const validMediaLots = DEMO_MEDIA_LOTS.filter(lot => {
    const expiryDate = new Date(lot.expiryDate);
    return (
      lot.gptTest.passed &&
      lot.sterilityTest.passed &&
      expiryDate > new Date()
    );
  });

  const selectedLotDetails = DEMO_MEDIA_LOTS.find(lot => lot.id === selectedLot);
  const totalPlatesRequired = session.samplingPoints.length;

  // Generate unique plate IDs
  const generatePlateIds = () => {
    const currentDate = new Date();
    const dateString = currentDate.toISOString().slice(0, 10).replace(/-/g, '');
    const timeString = currentDate.getTime().toString().slice(-6);
    const lotPrefix = selectedLotDetails?.lotNumber.slice(0, 3) || 'TSA';

    // Generate sample plate IDs
    const samplePlateIds = session.samplingPoints.map((pointId, index) => ({
      id: `${lotPrefix}-${dateString}-S${(index + 1).toString().padStart(2, '0')}-${timeString}`,
      pointId,
      type: 'sample' as const
    }));

    // Generate negative control plate IDs
    const ncCount = parseInt(negativeControlPlates) || 0;
    const negativeControlPlateIds = Array(ncCount).fill(null).map((_, index) => ({
      id: `${lotPrefix}-${dateString}-NC${(index + 1).toString().padStart(2, '0')}-${timeString}`,
      type: 'negative-control' as const
    }));

    return {
      samplePlates: samplePlateIds,
      negativeControlPlates: negativeControlPlateIds
    };
  };

  const handleVerifyLot = () => {
    if (!selectedLotDetails || !negativeControlPlates) return;

    const plateIds = generatePlateIds();

    const startDetails: SessionStartDetails = {
      actualStartTime: new Date(),
      mediaDetails: {
        lotNumber: selectedLotDetails.lotNumber,
        numberOfPlates: totalPlatesRequired,
        negativeControlPlates: parseInt(negativeControlPlates),
        expiryDate: new Date(selectedLotDetails.expiryDate),
        verificationDetails: {
          lotNumber: selectedLotDetails.lotNumber,
          expiryDate: new Date(selectedLotDetails.expiryDate),
          gptPassed: selectedLotDetails.gptTest.passed,
          gptDate: new Date(selectedLotDetails.gptTest.date),
          sterilityPassed: selectedLotDetails.sterilityTest.passed,
          sterilityDate: new Date(selectedLotDetails.sterilityTest.date),
          growthPromotionResults: {
            trypticSoyAgar: true,
            sabouraudDextroseAgar: true
          }
        },
        plates: {
          sample: plateIds.samplePlates,
          negativeControl: plateIds.negativeControlPlates
        }
      }
    };

    onStartSession(session.id, startDetails);
    navigate(`/sessions/${session.id}/store-controls`);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow sm:rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Media Lot Verification</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Required Plates</label>
            <p className="mt-1 text-sm text-gray-500">
              Number of sampling points: {totalPlatesRequired}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Media Lot</label>
            <select
              value={selectedLot}
              onChange={(e) => setSelectedLot(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select Media Lot</option>
              {validMediaLots.map(lot => (
                <option key={lot.id} value={lot.id}>
                  {lot.lotNumber} - {lot.type} (Expires: {new Date(lot.expiryDate).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Negative Control Plates</label>
            <input
              type="number"
              min="1"
              value={negativeControlPlates}
              onChange={(e) => setNegativeControlPlates(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {selectedLotDetails && (
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Media Lot Details</h3>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Lot Number</dt>
                  <dd className="text-sm text-gray-900">{selectedLotDetails.lotNumber}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Media Type</dt>
                  <dd className="text-sm text-gray-900">{selectedLotDetails.type}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Expiry Date</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(selectedLotDetails.expiryDate).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="text-sm text-green-600">Verified & Ready to Use</dd>
                </div>
              </dl>
            </div>
          )}

          {selectedLotDetails && negativeControlPlates && (
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-blue-700 mb-2">Preview Plate IDs</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-medium text-blue-600">Sample Plates</h4>
                  <div className="mt-1 text-sm text-blue-900 space-y-1">
                    {generatePlateIds().samplePlates.slice(0, 2).map((plate, index) => (
                      <div key={index}>{plate.id}{index === 1 && totalPlatesRequired > 2 ? ' ...' : ''}</div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-blue-600">Negative Control Plates</h4>
                  <div className="mt-1 text-sm text-blue-900 space-y-1">
                    {generatePlateIds().negativeControlPlates.slice(0, 2).map((plate, index) => (
                      <div key={index}>{plate.id}{index === 1 && parseInt(negativeControlPlates) > 2 ? ' ...' : ''}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/sessions')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleVerifyLot}
              disabled={!selectedLot || !negativeControlPlates}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              Verify Lot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};