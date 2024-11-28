export interface TimeSlot {
  hour: number;
  minute: number;
  description?: string;
}

export interface MonitoringSchedule {
  id: string;
  monitoringType: 'settle-plate';
  samplingPoints: string[];
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
  tolerance: {
    value: number;
    unit: 'minutes' | 'hours' | 'days';
  };
  startDate: Date;
  endDate?: Date;
  timeSlots: TimeSlot[];
  assignedPersonnel: string[];
  status: 'active' | 'completed';
  nextSession?: Date;
  activityStatus: {
    type: 'production-ongoing' | 'idle';
    batchId?: string;
  };
}