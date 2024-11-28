import React, { useState } from 'react';
import { TimeSlotInput } from './TimeSlotInput';
import { TimeSlot } from '../../types/scheduler';
import { MonitoringSchedule } from '../../types/monitoring';
import { DEMO_PRODUCTS, DEMO_BATCHES } from '../../data/demo';

interface Props {
  areas: any[];
  rooms: any[];
  samplingPoints: any[];
  onSubmit: (data: Partial<MonitoringSchedule>) => void;
  onCancel: () => void;
}

export const ScheduleForm: React.FC<Props> = ({
  areas,
  rooms,
  samplingPoints,
  onSubmit,
  onCancel,
}) => {
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [selectedPoints, setSelectedPoints] = useState<string[]>([]);
  const [frequency, setFrequency] = useState<'hourly' | 'daily' | 'weekly' | 'monthly'>('daily');
  const [toleranceValue, setToleranceValue] = useState('15');
  const [toleranceUnit, setToleranceUnit] = useState<'minutes' | 'hours' | 'days'>('minutes');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [activityStatus, setActivityStatus] = useState<'production-ongoing' | 'idle'>('idle');
  const [selectedBatch, setSelectedBatch] = useState<string>('');

  const filteredRooms = rooms.filter(room => room.areaId === selectedArea);
  const filteredPoints = samplingPoints.filter(point => selectedRooms.includes(point.roomId));

  const selectedBatchDetails = DEMO_BATCHES.find(b => b.id === selectedBatch);
  const selectedProduct = selectedBatchDetails 
    ? DEMO_PRODUCTS.find(p => p.id === selectedBatchDetails.productId)
    : null;

  const handleAddTimeSlot = () => {
    setTimeSlots([...timeSlots, { hour: 0, minute: 0 }]);
  };

  const handleTimeSlotChange = (index: number, field: 'hour' | 'minute', value: string) => {
    const newTimeSlots = [...timeSlots];
    newTimeSlots[index] = {
      ...newTimeSlots[index],
      [field]: parseInt(value) || 0
    };
    setTimeSlots(newTimeSlots);
  };

  const handleRemoveTimeSlot = (index: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (timeSlots.length === 0) {
      alert('At least one time slot is required');
      return;
    }

    onSubmit({
      monitoringType: 'settle-plate',
      samplingPoints: selectedPoints,
      frequency,
      tolerance: {
        value: parseInt(toleranceValue) || 15,
        unit: toleranceUnit
      },
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      timeSlots,
      assignedPersonnel: [],
      status: 'active',
      activityStatus: {
        type: activityStatus,
        batchId: activityStatus === 'production-ongoing' ? selectedBatch : undefined
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      {/* Area Selection */}
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

      {/* Room Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Rooms</label>
        <div className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-3">
          {filteredRooms.map(room => (
            <label key={room.id} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedRooms.includes(room.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedRooms([...selectedRooms, room.id]);
                  } else {
                    setSelectedRooms(selectedRooms.filter(id => id !== room.id));
                    setSelectedPoints(prev => prev.filter(pointId => {
                      const point = samplingPoints.find(p => p.id === pointId);
                      return point && point.roomId !== room.id;
                    }));
                  }
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                {room.name} ({room.roomNumber}) - Class {room.cleanRoomClass}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Sampling Points */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Sampling Points</label>
        <div className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-3">
          {filteredPoints.map(point => (
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
              <span className="ml-2 text-sm text-gray-700">{point.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Schedule Details */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Frequency</label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as 'hourly' | 'daily' | 'weekly' | 'monthly')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tolerance</label>
          <div className="flex space-x-2">
            <input
              type="number"
              min="1"
              value={toleranceValue}
              onChange={(e) => setToleranceValue(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <select
              value={toleranceUnit}
              onChange={(e) => setToleranceUnit(e.target.value as 'minutes' | 'hours' | 'days')}
              className="mt-1 block w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="minutes">Minutes</option>
              <option value="hours">Hours</option>
              <option value="days">Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date (Optional)</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Time Slots */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">Time Slots</label>
          <button
            type="button"
            onClick={handleAddTimeSlot}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Add Time Slot
          </button>
        </div>
        <div className="space-y-2">
          {timeSlots.map((slot, index) => (
            <TimeSlotInput
              key={index}
              slot={slot}
              index={index}
              onUpdate={handleTimeSlotChange}
              onRemove={handleRemoveTimeSlot}
            />
          ))}
        </div>
      </div>

      {/* Activity Status */}
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

      {/* Batch Selection */}
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

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Create Schedule
        </button>
      </div>
    </form>
  );
};