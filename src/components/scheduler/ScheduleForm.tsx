import React, { useState } from 'react';
import { TimeSlotInput } from './TimeSlotInput';
import { TimeSlot } from '../../types/scheduler';
import { MonitoringSchedule, ProductionArea, Room, SamplingPoint } from '../../types/monitoring';
import { DEMO_PRODUCTS, DEMO_BATCHES } from '../../data/demo';

interface Props {
  areas: ProductionArea[];
  rooms: Room[];
  samplingPoints: SamplingPoint[];
  onSubmit: (data: MonitoringSchedule) => void;
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
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([{ hour: 9, minute: 0 }]);
  const [activityStatus, setActivityStatus] = useState<'production-ongoing' | 'idle'>('idle');
  const [selectedBatch, setSelectedBatch] = useState<string>('');

  const filteredRooms = rooms.filter(room => room.areaId === selectedArea);
  const filteredPoints = samplingPoints.filter(point => selectedRooms.includes(point.roomId));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const schedule: MonitoringSchedule = {
      id: `SCH-${Date.now()}`,
      monitoringType: 'settle-plate',
      samplingPoints: selectedPoints,
      frequency,
      tolerance: {
        value: parseInt(toleranceValue),
        unit: toleranceUnit
      },
      startDate: new Date(startDate),
      timeSlots,
      assignedPersonnel: [],
      status: 'active',
      activityStatus: activityStatus === 'production-ongoing' 
        ? { type: 'production-ongoing', batchId: selectedBatch }
        : { type: 'idle' },
      nextSession: new Date(startDate)
    };

    onSubmit(schedule);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Create Monitoring Schedule</h3>
          <p className="mt-1 text-sm text-gray-500">
            Set up a new environmental monitoring schedule for settle plates.
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
            required
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

        {/* Schedule Configuration */}
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as any)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              required
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tolerance</label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="number"
                value={toleranceValue}
                onChange={(e) => setToleranceValue(e.target.value)}
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
                required
              />
              <select
                value={toleranceUnit}
                onChange={(e) => setToleranceUnit(e.target.value as any)}
                className="-ml-px block w-28 pl-3 pr-9 py-2 rounded-r-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Time Slots */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Time Slots</label>
            <button
              type="button"
              onClick={() => setTimeSlots([...timeSlots, { hour: 0, minute: 0 }])}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Time Slot
            </button>
          </div>
          <div className="space-y-2">
            {timeSlots.map((slot, index) => (
              <div key={index} className="flex items-center space-x-2">
                <TimeSlotInput
                  value={slot}
                  onChange={(newSlot) => {
                    const newSlots = [...timeSlots];
                    newSlots[index] = newSlot;
                    setTimeSlots(newSlots);
                  }}
                />
                {timeSlots.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setTimeSlots(timeSlots.filter((_, i) => i !== index))}
                    className="text-red-600 hover:text-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
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

        {/* Batch Selection */}
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
            Create Schedule
          </button>
        </div>
      </div>
    </form>
  );
};