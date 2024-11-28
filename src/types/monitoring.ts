export interface Location {
  id: string;
  name: string;
  roomNumber: string;
  cleanRoomClass: string;
  monitoringFrequency: string;
}

export interface SettlePlate {
  id: string;
  locationId: string;
  exposureStartTime: Date;
  collectedBy: string;
  status: 'active' | 'completed' | 'cancelled';
}

export interface ProductionArea {
  id: string;
  name: string;
  type: 'production' | 'laboratory';
}

export interface Room {
  id: string;
  areaId: string;
  name: string;
  roomNumber: string;
  cleanRoomClass: string;
}

export interface SamplingPoint {
  id: string;
  roomId: string;
  name: string;
}

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
  activityStatus: {
    type: 'production-ongoing' | 'idle';
    batchId?: string;
  };
  nextSession?: Date;
}

export interface MediaVerification {
  lotNumber: string;
  expiryDate: Date;
  gptPassed: boolean;
  gptDate: Date;
  sterilityPassed: boolean;
  sterilityDate: Date;
  growthPromotionResults: {
    trypticSoyAgar: boolean;
    sabouraudDextroseAgar: boolean;
  };
}

export interface SessionStartDetails {
  actualStartTime: Date;
  mediaDetails: {
    lotNumber: string;
    numberOfPlates: number;
    negativeControlPlates: number;
    expiryDate: Date;
    verificationDetails?: MediaVerification;
    plates?: {
      sample: Array<{
        id: string;
        pointId: string;
        type: 'sample';
      }>;
      negativeControl: Array<{
        id: string;
        type: 'negative-control';
      }>;
    };
  };
}

export interface MonitoringSession {
  id: string;
  scheduleId?: string;
  scheduledTime: Date;
  samplingPoints: string[];
  status: 'pending' | 'in-progress' | 'completed';
  plates: any[];
  activityStatus: {
    type: 'production-ongoing' | 'idle';
    batchId?: string;
  };
  batchDetails?: {
    batchId: string;
    productId: string;
  };
  startDetails?: SessionStartDetails;
  negativeControlStorage?: {
    storageTime: Date;
    endTime?: Date;
    storageLocation: string;
    storedBy: string;
    temperature: number;
  };
  exposures?: Array<{
    pointId: string;
    plateId: string;
    startTime?: Date;
    endTime?: Date;
    skipped?: boolean;
    skipReason?: string;
    damaged?: boolean;
    damageReason?: string;
    earlyEndReason?: string;
  }>;
  incubation?: {
    startTime: Date;
    plates: Array<{
      id: string;
      type: 'sample' | 'negative-control';
    }>;
    stage1CompletionTime?: Date;
    stage1CompletedBy?: string;
    stage1Readings?: Array<{
      time: Date;
      temperature: number;
      recordedBy: string;
      comments?: string;
    }>;
    stage1IncubatorChanges?: Array<{
      time: Date;
      fromIncubator: string;
      toIncubator: string;
      reason: string;
      changedBy: string;
    }>;
    stage2StartTime?: Date;
    stage2CompletionTime?: Date;
    stage2CompletedBy?: string;
    stage2Readings?: Array<{
      time: Date;
      temperature: number;
      recordedBy: string;
      comments?: string;
    }>;
    stage2IncubatorChanges?: Array<{
      time: Date;
      fromIncubator: string;
      toIncubator: string;
      reason: string;
      changedBy: string;
    }>;
    status?: 'in-progress' | 'stage1-completed' | 'completed';
    currentStage?: 1 | 2;
  };
}

export interface IncubationBatch {
  id: string;
  mediaType: 'TSA' | 'SDA';
  startTime: Date;
  sessions: string[];
  plates: {
    id: string;
    type: 'sample' | 'negative-control';
    sessionId: string;
  }[];
  status: 'in-progress' | 'stage1-completed' | 'completed';
  currentStage: 1 | 2;
  currentIncubator: string;
  temperature: number;
  temperatureReadings: {
    time: Date;
    temperature: number;
    recordedBy: string;
  }[];
  stage1CompletionTime?: Date;
  stage2StartTime?: Date;
  stage2CompletionTime?: Date;
}