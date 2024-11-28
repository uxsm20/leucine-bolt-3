import React, { useState } from 'react';
import { MonitoringSession, ProductionArea, Room, SamplingPoint } from '../../types/monitoring';
import { DEMO_PRODUCTS, DEMO_BATCHES } from '../../data/demo';
import { FormSelect } from '../shared/forms/FormSelect';
import { FormCheckboxGroup } from '../shared/forms/FormCheckboxGroup';
import { FormInput } from '../shared/forms/FormInput';
import { FormCard } from '../shared/forms/FormCard';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredRooms = rooms.filter(room => room.areaId === selectedArea);
  const filteredPoints = samplingPoints.filter(point => selectedRooms.includes(point.roomId));

  const selectedBatchDetails = DEMO_BATCHES.find(b => b.id === selectedBatch);
  const selectedProduct = selectedBatchDetails 
    ? DEMO_PRODUCTS.find(p => p.id === selectedBatchDetails.productId)
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        id: `SES-${Date.now()}`,
        monitoringType: 'settle-plate',
        samplingPoints: selectedPoints,
        scheduledTime: new Date(scheduledTime),
        activityStatus,
        batch: selectedBatchDetails,
        product: selectedProduct,
        status: 'pending',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormCard
      title="Create Monitoring Session"
      onSubmit={handleSubmit}
      onCancel={onCancel}
      submitLabel="Create Session"
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

      <FormInput
        type="datetime-local"
        label="Scheduled Time"
        value={scheduledTime}
        onChange={(e) => setScheduledTime(e.target.value)}
        required
      />

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

      <FormSelect
        label="Batch"
        options={DEMO_BATCHES.map(batch => ({
          value: batch.id,
          label: `${batch.number} (${DEMO_PRODUCTS.find(p => p.id === batch.productId)?.name})`
        }))}
        value={selectedBatch}
        onChange={setSelectedBatch}
        helperText="Select the batch being produced"
      />
    </FormCard>
  );
};