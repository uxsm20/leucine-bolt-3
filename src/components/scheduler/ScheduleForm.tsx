import React, { useState } from 'react';
import { TimeSlotInput } from './TimeSlotInput';
import { TimeSlot } from '../../types/scheduler';
import { MonitoringSchedule, ProductionArea, Room, SamplingPoint } from '../../types/monitoring';
import { DEMO_PRODUCTS, DEMO_BATCHES } from '../../data/demo';
import { FormSelect } from '../shared/forms/FormSelect';
import { FormCheckboxGroup } from '../shared/forms/FormCheckboxGroup';
import { FormInput } from '../shared/forms/FormInput';
import { FormCard } from '../shared/forms/FormCard';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredRooms = rooms.filter(room => room.areaId === selectedArea);
  const filteredPoints = samplingPoints.filter(point => selectedRooms.includes(point.roomId));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
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
      };
      
      await onSubmit(schedule);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormCard
      title="Create Monitoring Schedule"
      onSubmit={handleSubmit}
      onCancel={onCancel}
      submitLabel="Create Schedule"
      isSubmitting={isSubmitting}
    >
      <FormSelect
        label="Production Area"
        options={areas.map(area => ({ value: area.id, label: area.name }))}
        value={selectedArea}
        onChange={setSelectedArea}
        required
      />

      <FormCheckboxGroup
        label="Rooms"
        options={filteredRooms.map(room => ({ value: room.id, label: room.name }))}
        selectedValues={selectedRooms}
        onChange={setSelectedRooms}
        helperText="Select rooms for monitoring"
      />

      <FormCheckboxGroup
        label="Sampling Points"
        options={filteredPoints.map(point => ({ value: point.id, label: point.name }))}
        selectedValues={selectedPoints}
        onChange={setSelectedPoints}
        helperText="Select sampling points for monitoring"
      />

      <FormSelect
        label="Frequency"
        options={[
          { value: 'hourly', label: 'Hourly' },
          { value: 'daily', label: 'Daily' },
          { value: 'weekly', label: 'Weekly' },
          { value: 'monthly', label: 'Monthly' }
        ]}
        value={frequency}
        onChange={(value) => setFrequency(value as 'hourly' | 'daily' | 'weekly' | 'monthly')}
        required
      />

      <div className="flex space-x-4">
        <FormInput
          type="number"
          label="Tolerance"
          value={toleranceValue}
          onChange={(e) => setToleranceValue(e.target.value)}
          min="1"
          required
          className="flex-1"
        />

        <FormSelect
          label="Unit"
          options={[
            { value: 'minutes', label: 'Minutes' },
            { value: 'hours', label: 'Hours' },
            { value: 'days', label: 'Days' }
          ]}
          value={toleranceUnit}
          onChange={(value) => setToleranceUnit(value as 'minutes' | 'hours' | 'days')}
          required
          className="flex-1"
        />
      </div>

      <FormInput
        type="date"
        label="Start Date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        required
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Time Slots</label>
        {timeSlots.map((slot, index) => (
          <TimeSlotInput
            key={index}
            value={slot}
            onChange={(newSlot) => {
              const newTimeSlots = [...timeSlots];
              newTimeSlots[index] = newSlot;
              setTimeSlots(newTimeSlots);
            }}
            onRemove={() => {
              if (timeSlots.length > 1) {
                setTimeSlots(timeSlots.filter((_, i) => i !== index));
              }
            }}
          />
        ))}
        <button
          type="button"
          onClick={() => setTimeSlots([...timeSlots, { hour: 9, minute: 0 }])}
          className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs
                   font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add Time Slot
        </button>
      </div>

      <FormSelect
        label="Activity Status"
        options={[
          { value: 'production-ongoing', label: 'Production Ongoing' },
          { value: 'idle', label: 'Idle' }
        ]}
        value={activityStatus}
        onChange={(value) => setActivityStatus(value as 'production-ongoing' | 'idle')}
        required
      />

      {activityStatus === 'production-ongoing' && (
        <FormSelect
          label="Batch"
          options={DEMO_BATCHES.map(batch => ({
            value: batch.id,
            label: `${batch.number} (${DEMO_PRODUCTS.find(p => p.id === batch.productId)?.name})`
          }))}
          value={selectedBatch}
          onChange={setSelectedBatch}
          helperText="Select the batch being produced"
          required
        />
      )}
    </FormCard>
  );
};