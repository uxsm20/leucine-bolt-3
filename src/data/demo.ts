// Production Areas
export const DEMO_AREAS = [
  { id: 'AREA-001', name: 'Sterile Manufacturing', type: 'production' },
  { id: 'AREA-002', name: 'Aseptic Processing', type: 'production' },
  { id: 'AREA-003', name: 'Quality Control', type: 'laboratory' }
];

// Rooms
export const DEMO_ROOMS = [
  { id: 'ROOM-001', areaId: 'AREA-001', name: 'Filling Room', roomNumber: 'FR-101', cleanRoomClass: 'A' },
  { id: 'ROOM-002', areaId: 'AREA-001', name: 'Material Airlock', roomNumber: 'MA-102', cleanRoomClass: 'B' },
  { id: 'ROOM-003', areaId: 'AREA-002', name: 'Compounding Room', roomNumber: 'CR-201', cleanRoomClass: 'B' }
];

// Sampling Points
export const DEMO_POINTS = [
  { id: 'POINT-001', roomId: 'ROOM-001', name: 'Near RABS - Left' },
  { id: 'POINT-002', roomId: 'ROOM-001', name: 'Near RABS - Right' },
  { id: 'POINT-003', roomId: 'ROOM-002', name: 'Near Door - Entry' },
  { id: 'POINT-004', roomId: 'ROOM-002', name: 'Near Door - Exit' }
];

// Products
export const DEMO_PRODUCTS = [
  { id: 'PROD-001', name: 'Product A', code: 'PA-001' },
  { id: 'PROD-002', name: 'Product B', code: 'PB-002' },
  { id: 'PROD-003', name: 'Product C', code: 'PC-003' }
];

// Production Batches
export const DEMO_BATCHES = [
  { id: 'BATCH-001', number: 'B2023001', productId: 'PROD-001', status: 'in-progress' },
  { id: 'BATCH-002', number: 'B2023002', productId: 'PROD-002', status: 'in-progress' },
  { id: 'BATCH-003', number: 'B2023003', productId: 'PROD-003', status: 'planned' }
];

// Media Lots
export const DEMO_MEDIA_LOTS = [
  {
    id: 'ML-001',
    lotNumber: 'TSA-2023-001',
    type: 'TSA',
    expiryDate: '2024-12-31',
    gptTest: {
      passed: true,
      date: '2023-10-15'
    },
    sterilityTest: {
      passed: true,
      date: '2023-10-16'
    }
  },
  {
    id: 'ML-002',
    lotNumber: 'TSA-2023-002',
    type: 'TSA',
    expiryDate: '2024-11-30',
    gptTest: {
      passed: true,
      date: '2023-10-01'
    },
    sterilityTest: {
      passed: false,
      date: '2023-10-02'
    }
  },
  {
    id: 'ML-003',
    lotNumber: 'TSA-2023-003',
    type: 'TSA',
    expiryDate: '2024-12-31',
    gptTest: {
      passed: true,
      date: '2023-10-20'
    },
    sterilityTest: {
      passed: true,
      date: '2023-10-21'
    }
  },
  {
    id: 'ML-004',
    lotNumber: 'SDA-2023-001',
    type: 'SDA',
    expiryDate: '2024-12-31',
    gptTest: {
      passed: true,
      date: '2023-10-15'
    },
    sterilityTest: {
      passed: true,
      date: '2023-10-16'
    }
  }
];

// Demo Sessions
export const DEMO_SESSIONS = [
  // Session ready for incubation
  {
    id: 'SESSION-001',
    scheduleId: 'SCH-001',
    scheduledTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // Yesterday
    samplingPoints: ['POINT-001', 'POINT-002'],
    status: 'in-progress',
    plates: [],
    activityStatus: { 
      type: 'production-ongoing',
      batchId: 'BATCH-001'
    },
    startDetails: {
      actualStartTime: new Date(Date.now() - 1000 * 60 * 60 * 23), // 23 hours ago
      mediaDetails: {
        lotNumber: 'TSA-2023-001',
        numberOfPlates: 2,
        negativeControlPlates: 1,
        expiryDate: new Date('2024-12-31'),
        plates: {
          sample: [
            { id: 'TSA-20231123-S01-123456', pointId: 'POINT-001', type: 'sample' },
            { id: 'TSA-20231123-S02-123456', pointId: 'POINT-002', type: 'sample' }
          ],
          negativeControl: [
            { id: 'TSA-20231123-NC01-123456', type: 'negative-control' }
          ]
        }
      }
    },
    exposures: [
      {
        pointId: 'POINT-001',
        plateId: 'TSA-20231123-S01-123456',
        startTime: new Date(Date.now() - 1000 * 60 * 60 * 22),
        endTime: new Date(Date.now() - 1000 * 60 * 60 * 18)
      },
      {
        pointId: 'POINT-002',
        plateId: 'TSA-20231123-S02-123456',
        startTime: new Date(Date.now() - 1000 * 60 * 60 * 22),
        endTime: new Date(Date.now() - 1000 * 60 * 60 * 18)
      }
    ],
    negativeControlStorage: {
      storageTime: new Date(Date.now() - 1000 * 60 * 60 * 23),
      endTime: new Date(Date.now() - 1000 * 60 * 60 * 22),
      storageLocation: 'sterile-incubator-1',
      storedBy: 'John Doe',
      temperature: 20
    }
  },
  // Session in Stage 1 incubation
  {
    id: 'SESSION-002',
    scheduleId: 'SCH-001',
    scheduledTime: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    samplingPoints: ['POINT-003', 'POINT-004'],
    status: 'in-progress',
    plates: [],
    activityStatus: { 
      type: 'production-ongoing',
      batchId: 'BATCH-002'
    },
    startDetails: {
      actualStartTime: new Date(Date.now() - 1000 * 60 * 60 * 47),
      mediaDetails: {
        lotNumber: 'TSA-2023-001',
        numberOfPlates: 2,
        negativeControlPlates: 1,
        expiryDate: new Date('2024-12-31'),
        plates: {
          sample: [
            { id: 'TSA-20231123-S03-789012', pointId: 'POINT-003', type: 'sample' },
            { id: 'TSA-20231123-S04-789012', pointId: 'POINT-004', type: 'sample' }
          ],
          negativeControl: [
            { id: 'TSA-20231123-NC02-789012', type: 'negative-control' }
          ]
        }
      }
    },
    exposures: [
      {
        pointId: 'POINT-003',
        plateId: 'TSA-20231123-S03-789012',
        startTime: new Date(Date.now() - 1000 * 60 * 60 * 46),
        endTime: new Date(Date.now() - 1000 * 60 * 60 * 42)
      },
      {
        pointId: 'POINT-004',
        plateId: 'TSA-20231123-S04-789012',
        startTime: new Date(Date.now() - 1000 * 60 * 60 * 46),
        endTime: new Date(Date.now() - 1000 * 60 * 60 * 42)
      }
    ],
    negativeControlStorage: {
      storageTime: new Date(Date.now() - 1000 * 60 * 60 * 47),
      endTime: new Date(Date.now() - 1000 * 60 * 60 * 46),
      storageLocation: 'sterile-incubator-1',
      storedBy: 'Jane Smith',
      temperature: 20
    },
    incubation: {
      startTime: new Date(Date.now() - 1000 * 60 * 60 * 42),
      plates: [
        { id: 'TSA-20231123-S03-789012', type: 'sample' },
        { id: 'TSA-20231123-S04-789012', type: 'sample' },
        { id: 'TSA-20231123-NC02-789012', type: 'negative-control' }
      ]
    }
  },
  // Session ready for Stage 2
  {
    id: 'SESSION-003',
    scheduleId: 'SCH-002',
    scheduledTime: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
    samplingPoints: ['POINT-001', 'POINT-002'],
    status: 'in-progress',
    plates: [],
    activityStatus: { type: 'idle' },
    startDetails: {
      actualStartTime: new Date(Date.now() - 1000 * 60 * 60 * 71),
      mediaDetails: {
        lotNumber: 'TSA-2023-003',
        numberOfPlates: 2,
        negativeControlPlates: 1,
        expiryDate: new Date('2024-12-31'),
        plates: {
          sample: [
            { id: 'TSA-20231124-S01-345678', pointId: 'POINT-001', type: 'sample' },
            { id: 'TSA-20231124-S02-345678', pointId: 'POINT-002', type: 'sample' }
          ],
          negativeControl: [
            { id: 'TSA-20231124-NC01-345678', type: 'negative-control' }
          ]
        }
      }
    },
    exposures: [
      {
        pointId: 'POINT-001',
        plateId: 'TSA-20231124-S01-345678',
        startTime: new Date(Date.now() - 1000 * 60 * 60 * 70),
        endTime: new Date(Date.now() - 1000 * 60 * 60 * 66)
      },
      {
        pointId: 'POINT-002',
        plateId: 'TSA-20231124-S02-345678',
        startTime: new Date(Date.now() - 1000 * 60 * 60 * 70),
        endTime: new Date(Date.now() - 1000 * 60 * 60 * 66)
      }
    ],
    negativeControlStorage: {
      storageTime: new Date(Date.now() - 1000 * 60 * 60 * 71),
      endTime: new Date(Date.now() - 1000 * 60 * 60 * 70),
      storageLocation: 'sterile-incubator-2',
      storedBy: 'John Doe',
      temperature: 20
    },
    incubation: {
      startTime: new Date(Date.now() - 1000 * 60 * 60 * 66),
      stage1CompletionTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
      status: 'stage1-completed',
      plates: [
        { id: 'TSA-20231124-S01-345678', type: 'sample' },
        { id: 'TSA-20231124-S02-345678', type: 'sample' },
        { id: 'TSA-20231124-NC01-345678', type: 'negative-control' }
      ]
    }
  }
];

// Demo Schedules
export const DEMO_SCHEDULES = [
  {
    id: 'SCH-001',
    monitoringType: 'settle-plate',
    samplingPoints: ['POINT-001', 'POINT-002'],
    frequency: 'daily',
    tolerance: {
      value: 15,
      unit: 'minutes'
    },
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
    timeSlots: [
      { hour: 9, minute: 0 },
      { hour: 14, minute: 0 }
    ],
    assignedPersonnel: [],
    status: 'active',
    activityStatus: {
      type: 'production-ongoing',
      batchId: 'BATCH-001'
    },
    nextSession: new Date(Date.now() + 1000 * 60 * 60 * 24) // Tomorrow
  },
  {
    id: 'SCH-002',
    monitoringType: 'settle-plate',
    samplingPoints: ['POINT-003', 'POINT-004'],
    frequency: 'weekly',
    tolerance: {
      value: 1,
      unit: 'hours'
    },
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
    timeSlots: [
      { hour: 10, minute: 0 }
    ],
    assignedPersonnel: [],
    status: 'active',
    activityStatus: {
      type: 'idle'
    },
    nextSession: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3) // 3 days from now
  }
];

// Demo Incubation Batches
export const DEMO_INCUBATION_BATCHES = [
  // Batch in Stage 1
  {
    id: 'INC-001',
    mediaType: 'TSA',
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 42), // 42 hours ago
    sessions: ['SESSION-002'],
    plates: [
      { id: 'TSA-20231123-S03-789012', type: 'sample', sessionId: 'SESSION-002' },
      { id: 'TSA-20231123-S04-789012', type: 'sample', sessionId: 'SESSION-002' },
      { id: 'TSA-20231123-NC02-789012', type: 'negative-control', sessionId: 'SESSION-002' }
    ],
    status: 'in-progress',
    currentStage: 1,
    currentIncubator: 'INC-001',
    temperature: 32.5,
    temperatureReadings: [
      { time: new Date(Date.now() - 1000 * 60 * 60 * 42), temperature: 32.5, recordedBy: 'John Doe' },
      { time: new Date(Date.now() - 1000 * 60 * 60 * 36), temperature: 32.6, recordedBy: 'Jane Smith' },
      { time: new Date(Date.now() - 1000 * 60 * 60 * 30), temperature: 32.5, recordedBy: 'John Doe' },
      { time: new Date(Date.now() - 1000 * 60 * 60 * 24), temperature: 32.5, recordedBy: 'Jane Smith' },
      { time: new Date(Date.now() - 1000 * 60 * 60 * 18), temperature: 32.5, recordedBy: 'John Doe' }
    ]
  },
  // Batch ready for Stage 2
  {
    id: 'INC-002',
    mediaType: 'TSA',
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 66), // 66 hours ago
    sessions: ['SESSION-003'],
    plates: [
      { id: 'TSA-20231124-S01-345678', type: 'sample', sessionId: 'SESSION-003' },
      { id: 'TSA-20231124-S02-345678', type: 'sample', sessionId: 'SESSION-003' },
      { id: 'TSA-20231124-NC01-345678', type: 'negative-control', sessionId: 'SESSION-003' }
    ],
    status: 'stage1-completed',
    currentStage: 1,
    currentIncubator: 'INC-002',
    temperature: 32.8,
    temperatureReadings: [
      { time: new Date(Date.now() - 1000 * 60 * 60 * 66), temperature: 32.5, recordedBy: 'John Doe' },
      { time: new Date(Date.now() - 1000 * 60 * 60 * 60), temperature: 32.6, recordedBy: 'John Doe' },
      { time: new Date(Date.now() - 1000 * 60 * 60 * 54), temperature: 32.7, recordedBy: 'Jane Smith' },
      { time: new Date(Date.now() - 1000 * 60 * 60 * 48), temperature: 32.8, recordedBy: 'John Doe' },
      { time: new Date(Date.now() - 1000 * 60 * 60 * 42), temperature: 32.8, recordedBy: 'Jane Smith' },
      { time: new Date(Date.now() - 1000 * 60 * 60 * 36), temperature: 32.8, recordedBy: 'John Doe' }
    ],
    stage1CompletionTime: new Date(Date.now() - 1000 * 60 * 60 * 24) // 24 hours ago
  },
  // Completed batch
  {
    id: 'INC-003',
    mediaType: 'TSA',
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 96), // 96 hours ago
    sessions: ['SESSION-001'],
    plates: [
      { id: 'TSA-20231123-S01-123456', type: 'sample', sessionId: 'SESSION-001' },
      { id: 'TSA-20231123-S02-123456', type: 'sample', sessionId: 'SESSION-001' },
      { id: 'TSA-20231123-NC01-123456', type: 'negative-control', sessionId: 'SESSION-001' }
    ],
    status: 'completed',
    currentStage: 2,
    currentIncubator: 'INC-003',
    temperature: 22.5,
    temperatureReadings: [
      // Stage 1 readings
      { time: new Date(Date.now() - 1000 * 60 * 60 * 96), temperature: 32.5, recordedBy: 'John Doe' },
      { time: new Date(Date.now() - 1000 * 60 * 60 * 90), temperature: 32.6, recordedBy: 'Jane Smith' },
      { time: new Date(Date.now() - 1000 * 60 * 60 * 84), temperature: 32.5, recordedBy: 'John Doe' },
      { time: new Date(Date.now() - 1000 * 60 * 60 * 78), temperature: 32.5, recordedBy: 'Jane Smith' },
      { time: new Date(Date.now() - 1000 * 60 * 60 * 72), temperature: 32.5, recordedBy: 'John Doe' },
      // Stage 2 readings
      { time: new Date(Date.now() - 1000 * 60 * 60 * 48), temperature: 22.5, recordedBy: 'John Doe' },
      { time: new Date(Date.now() - 1000 * 60 * 60 * 42), temperature: 22.5, recordedBy: 'Jane Smith' },
      { time: new Date(Date.now() - 1000 * 60 * 60 * 36), temperature: 22.5, recordedBy: 'John Doe' },
      { time: new Date(Date.now() - 1000 * 60 * 60 * 30), temperature: 22.5, recordedBy: 'Jane Smith' },
      { time: new Date(Date.now() - 1000 * 60 * 60 * 24), temperature: 22.5, recordedBy: 'John Doe' }
    ],
    stage1CompletionTime: new Date(Date.now() - 1000 * 60 * 60 * 48), // 48 hours ago
    stage2StartTime: new Date(Date.now() - 1000 * 60 * 60 * 47), // 47 hours ago
    stage2CompletionTime: new Date(Date.now() - 1000 * 60 * 60 * 1) // 1 hour ago
  }
];