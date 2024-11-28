import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { MonitoringSession } from './types/monitoring';
import { DEMO_SESSIONS } from './data/demo';
import { SessionsPage } from './components/sessions/SessionsPage';
import { SchedulerPage } from './components/scheduler/SchedulerPage';
import { IncubationDashboard } from './components/incubation/IncubationDashboard';
import { MediaVerificationPage } from './components/sessions/MediaVerificationPage';
import { Layout } from './components/Layout';
import { MonitoringDashboard } from './components/MonitoringDashboard';
import { SessionDetailsPage } from './components/sessions/SessionDetailsPage';
import { NegativeControlStoragePage } from './components/sessions/NegativeControlStoragePage';
import { SessionExecutionPage } from './components/sessions/SessionExecutionPage';
import { IncubationPage } from './components/sessions/IncubationPage';
import { CreateIncubationBatch } from './components/incubation/CreateIncubationBatch';
import { IncubatorAssignmentPage } from './components/incubation/IncubatorAssignmentPage';
import { IncubationMonitoringPage } from './components/incubation/IncubationMonitoringPage';
import { Stage2SetupPage } from './components/incubation/Stage2SetupPage';
import { SignInPage } from './components/auth/SignInPage';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessions, setSessions] = useState<MonitoringSession[]>([
    {
      id: 'session1',
      scheduleId: 'schedule1',
      scheduledTime: new Date(),
      samplingPoints: ['point1', 'point2'],
      status: 'pending' as const,
      plates: [],
      activityStatus: {
        type: 'idle' as const
      }
    },
    ...DEMO_SESSIONS.map(session => {
      const mappedSession = {
        ...session,
        status: session.status as 'completed' | 'pending' | 'in-progress',
        activityStatus: {
          ...session.activityStatus,
          type: session.activityStatus.type as 'production-ongoing' | 'idle'
        },
        scheduledTime: new Date(session.scheduledTime),
        startDetails: session.startDetails ? {
          ...session.startDetails,
          mediaDetails: {
            ...session.startDetails.mediaDetails,
            plates: {
              sample: session.startDetails.mediaDetails.plates?.sample.map(plate => ({
                ...plate,
                type: 'sample' as const
              })) || [],
              negativeControl: session.startDetails.mediaDetails.plates?.negativeControl.map(plate => ({
                ...plate,
                type: 'negative-control' as const
              })) || []
            }
          }
        } : undefined
      };
      return mappedSession;
    })
  ]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" /> : <SignInPage onLogin={handleLogin} />
        } />
        
        {isAuthenticated ? (
          <Route element={<Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} onLogout={handleLogout} />}>
            <Route index element={<MonitoringDashboard sessions={sessions} />} />
            <Route path="/scheduler" element={<SchedulerPage sessions={sessions} />} />
            <Route path="/incubation" element={<IncubationDashboard onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />} />
            <Route path="/sessions" element={<SessionsPage sessions={sessions} onCreateSession={(sessionData) => setSessions(prev => [...prev, sessionData as MonitoringSession])} />} />
            <Route path="/sessions/:sessionId" element={<SessionDetailsPage sessions={sessions} />}>
              <Route path="details" element={<SessionDetailsPage sessions={sessions} />} />
              <Route path="verify-media" element={<MediaVerificationPage sessions={sessions} onStartSession={(sessionId, startDetails) => {
                setSessions(prev => prev.map(session => 
                  session.id === sessionId
                    ? { ...session, status: 'in-progress' as const, startDetails }
                    : session
                ));
              }} />} />
              <Route path="store-controls" element={<NegativeControlStoragePage sessions={sessions} onStorageComplete={(sessionId, storageDetails) => {
                setSessions(prev => prev.map(session =>
                  session.id === sessionId
                    ? { ...session, negativeControlStorage: storageDetails }
                    : session
                ));
              }} />} />
              <Route path="execute" element={<SessionExecutionPage sessions={sessions} onUpdateSession={(sessionId, updates) => {
                setSessions(prev => prev.map(session =>
                  session.id === sessionId
                    ? { ...session, ...updates }
                    : session
                ));
              }} />} />
              <Route path="incubation" element={<IncubationPage sessions={sessions} onStartIncubation={(sessionId, details) => {
                setSessions(prev => prev.map(session =>
                  session.id === sessionId
                    ? { ...session, incubation: details }
                    : session
                ));
              }} />} />
            </Route>
            <Route path="/incubation" element={<IncubationDashboard onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />}>
              <Route path="new" element={<CreateIncubationBatch sessions={sessions} onCreateBatch={(sessionIds) => {
                const batchId = Date.now().toString();
                setSessions(prev => prev.map(session =>
                  sessionIds.includes(session.id)
                    ? { ...session, incubationBatchId: batchId }
                    : session
                ));
                return batchId;
              }} />} />
              <Route path="assign-incubator" element={<IncubatorAssignmentPage currentUser={{ id: '1', name: 'John Doe' }} onAssignIncubator={(id, details) => {
                setSessions(prev => prev.map(session =>
                  session.id === id
                    ? { ...session, incubatorAssignment: details }
                    : session
                ));
              }} />} />
              <Route path="monitor" element={<IncubationMonitoringPage currentUser={{ id: '1', name: 'John Doe' }} onUpdateIncubation={(id, details) => {
                setSessions(prev => prev.map(session =>
                  session.id === id
                    ? { ...session, ...details }
                    : session
                ));
              }} />} />
              <Route path="stage2-setup" element={<Stage2SetupPage currentUser={{ id: '1', name: 'John Doe' }} onStartStage2={(id, details) => {
                setSessions(prev => prev.map(session =>
                  session.id === id
                    ? { ...session, stage2Setup: details }
                    : session
                ));
              }} />} />
            </Route>
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;