import React, { useState } from 'react';
import { MonitoringSession, ProductionArea, Room, SamplingPoint } from '../../types/monitoring';
import { DEMO_PRODUCTS, DEMO_BATCHES } from '../../data/demo';

interface Props {
  areas: ProductionArea[];
  rooms: Room[];
  samplingPoints: SamplingPoint[];
  onSubmit: (data: Partial<MonitoringSession>) => void;
  onCancel: () => void;
}

export const SessionForm: React.FC<Props> = ({
  areas,
  rooms,
  samplingPoints,
  onSubmit,
  onCancel,
}) => {
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [selectedPoints, setSelectedPoints] = useState<string[]>([]);
  const [scheduledTime, setScheduledTime] = useState('');
  const [activityStatus, setActivityStatus] = useState<'production-ongoing' | 'idle'>('idle');
  const [selectedBatch, setSelectedBatch] = useState<string>('');

  const filteredRooms = rooms.filter(room => room.areaId === selectedArea);
  const filteredPoints = samplingPoints.filter(point => selectedRooms.includes(point.roomId));

  const selectedBatchDetails = DEMO_BATCHES.find(b => b.id === selectedBatch);
  const selectedProduct = selectedBatchDetails 
    ? DEMO_PRODUCTS.find(p => p.id === selectedBatchDetails.productId)
    : null;

  const handleRoomChange = (roomId: string, checked: boolean) => {
    let newSelectedRooms: string[];
    if (checked) {
      newSelectedRooms = [...selectedRooms, roomId];
    } else {
      newSelectedRooms = selectedRooms.filter(id => id !== roomId);
      // Remove sampling points from unselected room
      setSelectedPoints(prev => prev.filter(pointId => {
        const point = samplingPoints.find(p => p.id === pointId);
        return point && newSelectedRooms.includes(point.roomId);
      }));
    }
    setSelectedRooms(newSelectedRooms);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const sessionData: Partial<MonitoringSession> = {
      scheduledTime: new Date(scheduledTime),
      samplingPoints: selectedPoints,
      status: 'pending',
      plates: [],
      activityStatus: {
        type: activityStatus,
        batchId: activityStatus === 'production-ongoing' ? selectedBatch : undefined
      }
    };

    if (activityStatus === 'production-ongoing' && selectedBatch && selectedProduct) {
      sessionData.batchDetails = {
        batchId: selectedBatch,
        productId: selectedProduct.id
      };
    }

    onSubmit(sessionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Create Monitoring Session</h3>
          <p className="mt-1 text-sm text-gray-500">
            Select the area, rooms, and sampling points for the monitoring session.
          </p>
        </div>

        {/* Production Area Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Production Area</label>
          <select
            value={selectedArea}
            onChange={(e) => {
              setSelectedArea(e.target.value);
              setSelectedRooms([]);
              setSelectedPoints([]);
            }}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Select an area</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name} ({area.type})
              </option>
            ))}
          </select>
        </div>

        {/* Room Selection */}
        {selectedArea && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rooms</label>
            <div className="space-y-2">
              {filteredRooms.map((room) => (
                <div key={room.id} className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      checked={selectedRooms.includes(room.id)}
                      onChange={(e) => handleRoomChange(room.id, e.target.checked)}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label className="font-medium text-gray-700">
                      {room.name} - {room.roomNumber} (Class {room.cleanRoomClass})
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sampling Points Selection */}
        {selectedRooms.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sampling Points</label>
            <div className="space-y-2">
              {filteredPoints.map((point) => (
                <div key={point.id} className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      checked={selectedPoints.includes(point.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPoints([...selectedPoints, point.id]);
                        } else {
                          setSelectedPoints(selectedPoints.filter(id => id !== point.id));
                        }
                      }}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label className="font-medium text-gray-700">{point.name}</label>
                    <p className="text-gray-500">
                      {rooms.find(r => r.id === point.roomId)?.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scheduled Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Scheduled Time</label>
          <input
            type="datetime-local"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        {/* Production Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Production Status</label>
          <select
            value={activityStatus}
            onChange={(e) => setActivityStatus(e.target.value as 'production-ongoing' | 'idle')}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="idle">No Production</option>
            <option value="production-ongoing">Production Ongoing</option>
          </select>
        </div>

        {/* Batch Selection (only if production is ongoing) */}
        {activityStatus === 'production-ongoing' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Production Batch</label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              required
            >
              <option value="">Select a batch</option>
              {DEMO_BATCHES.filter(b => b.status === 'in-progress').map((batch) => (
                <option key={batch.id} value={batch.id}>
                  {batch.number} - {DEMO_PRODUCTS.find(p => p.id === batch.productId)?.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="pt-5">
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Session
          </button>
        </div>
      </div>
    </form>
  );
};