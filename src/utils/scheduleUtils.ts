import { MonitoringSchedule, MonitoringSession } from '../types/monitoring';

export const createSessionsFromSchedule = (schedule: MonitoringSchedule): MonitoringSession[] => {
  const now = new Date();
  const endDate = schedule.endDate ? new Date(schedule.endDate) : new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
  let currentDate = new Date(schedule.startDate);
  const sessions: MonitoringSession[] = [];

  while (currentDate <= endDate) {
    schedule.timeSlots.forEach(slot => {
      const sessionTime = new Date(currentDate);
      sessionTime.setHours(slot.hour, slot.minute, 0, 0);
      
      if (sessionTime >= now) {
        const sessionId = `${schedule.id}-${sessionTime.getTime()}`;
        sessions.push({
          id: sessionId,
          scheduleId: schedule.id,
          scheduledTime: sessionTime,
          samplingPoints: schedule.samplingPoints,
          status: 'pending',
          plates: [],
          activityStatus: schedule.activityStatus
        });
      }
    });

    switch (schedule.frequency) {
      case 'hourly':
        currentDate.setHours(currentDate.getHours() + 1);
        break;
      case 'daily':
        currentDate.setDate(currentDate.getDate() + 1);
        break;
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
    }
  }

  return sessions;
};