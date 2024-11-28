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
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div>
        <label className="block text-sm font-medium text-gray-700">Production Area</label>
        <select
          value={selectedArea}
          onChange={(e) => {
            setSelectedArea(e.target.value);
            setSelectedRooms([]);
            setSelectedPoints([]);
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">Select Area</option>
          {areas.map(area => (
            <option key={area.id} value={area.id}>{area.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Rooms</label>
        <div className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-3">
          {filteredRooms.map(room => (
            <label key={room.id} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedRooms.includes(room.id)}
                onChange={(e) => handleRoomChange(room.id, e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                {room.name} ({room.roomNumber}) - Class {room.cleanRoomClass}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Sampling Points</label>
        <div className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-3">
          {selectedRooms.length > 0 ? (
            filteredPoints.map(point => (
              <label key={point.id} className="flex items-center">
                <input
                  type="checkbox"
                  value={point.id}
                  checked={selectedPoints.includes(point.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPoints([...selectedPoints, point.id]);
                    } else {
                      setSelectedPoints(selectedPoints.filter(id => id !== point.id));
                    }
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {point.name} ({rooms.find(r => r.id === point.roomId)?.name})
                </span>
              </label>
            ))
          ) : (
            <p className="text-sm text-gray-500 p-2">Select rooms to view sampling points</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Scheduled Time</label>
        <input
          type="datetime-local"
          value={scheduledTime}
          onChange={(e) => setScheduledTime(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Activity Status</label>
        <select
          value={activityStatus}
          onChange={(e) => setActivityStatus(e.target.value as 'production-ongoing' | 'idle')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="idle">Idle</option>
          <option value="production-ongoing">Production Ongoing</option>
        </select>
      </div>

      {activityStatus === 'production-ongoing' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Batch</label>
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Select Batch</option>
            {DEMO_BATCHES.map(batch => (
              <option key={batch.id} value={batch.id}>
                {batch.number} - {DEMO_PRODUCTS.find(p => p.id === batch.productId)?.name}
              </option>
            ))}
          </select>
          {selectedProduct && (
            <p className="mt-2 text-sm text-gray-500">
              Product: {selectedProduct.name} ({selectedProduct.code})
            </p>
          )}
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create Session
        </button>
      </div>
    </form>
  );
};