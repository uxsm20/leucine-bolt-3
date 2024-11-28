import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

const App: React.FC = () => {
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
        } : undefined,
        incubation: session.incubation ? {
          ...session.incubation,
          status: session.incubation.status as 'completed' | 'in-progress' | 'stage1-completed',
          plates: session.incubation.plates.map(plate => ({
            ...plate,
            type: plate.type === 'sample' ? 'sample' as const : 'negative-control' as const
          }))
        } : undefined
      };

      return mappedSession;
    })
  ]);
  const [currentUser] = useState({ id: '1', name: 'John Doe' });

  const handleCreateSession = (sessionData: Partial<MonitoringSession>) => {
    setSessions(prev => [...prev, sessionData as MonitoringSession]);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Layout 
            sidebarOpen={sidebarOpen} 
            onCloseSidebar={setSidebarOpen}
            onLogout={() => {}}
          >
            <MonitoringDashboard sessions={sessions} />
          </Layout>
        } />

        <Route path="/scheduler" element={
          <Layout 
            sidebarOpen={sidebarOpen} 
            onCloseSidebar={setSidebarOpen}
            onLogout={() => {}}
          >
            <SchedulerPage sessions={sessions} />
          </Layout>
        } />

        <Route path="/sessions" element={
          <Layout 
            sidebarOpen={sidebarOpen} 
            onCloseSidebar={setSidebarOpen}
            onLogout={() => {}}
          >
            <SessionsPage
              sessions={sessions}
              onCreateSession={handleCreateSession}
            />
          </Layout>
        } />

        <Route path="/sessions/:sessionId/details" element={
          <Layout 
            sidebarOpen={sidebarOpen} 
            onCloseSidebar={setSidebarOpen}
            onLogout={() => {}}
          >
            <SessionDetailsPage sessions={sessions} />
          </Layout>
        } />

        <Route path="/sessions/:sessionId/verify-media" element={
          <Layout 
            sidebarOpen={sidebarOpen} 
            onCloseSidebar={setSidebarOpen}
            onLogout={() => {}}
          >
            <MediaVerificationPage 
              sessions={sessions}
              onStartSession={(sessionId, startDetails) => {
                setSessions(prev => prev.map(session => 
                  session.id === sessionId
                    ? { ...session, status: 'in-progress' as const, startDetails }
                    : session
                ));
              }}
            />
          </Layout>
        } />

        <Route path="/sessions/:sessionId/store-controls" element={
          <Layout 
            sidebarOpen={sidebarOpen} 
            onCloseSidebar={setSidebarOpen}
            onLogout={() => {}}
          >
            <NegativeControlStoragePage 
              sessions={sessions}
              onStorageComplete={(sessionId, storageDetails) => {
                setSessions(prev => prev.map(session =>
                  session.id === sessionId
                    ? { ...session, negativeControlStorage: storageDetails }
                    : session
                ));
              }}
            />
          </Layout>
        } />

        <Route path="/sessions/:sessionId/execute" element={
          <Layout 
            sidebarOpen={sidebarOpen} 
            onCloseSidebar={setSidebarOpen}
            onLogout={() => {}}
          >
            <SessionExecutionPage 
              sessions={sessions}
              onUpdateSession={(sessionId, updates) => {
                setSessions(prev => prev.map(session =>
                  session.id === sessionId
                    ? { ...session, ...updates }
                    : session
                ));
              }}
            />
          </Layout>
        } />

        <Route path="/sessions/:sessionId/incubation" element={
          <Layout 
            sidebarOpen={sidebarOpen} 
            onCloseSidebar={setSidebarOpen}
            onLogout={() => {}}
          >
            <IncubationPage 
              sessions={sessions}
              onStartIncubation={(sessionId, details) => {
                setSessions(prev => prev.map(session =>
                  session.id === sessionId
                    ? { ...session, incubation: details }
                    : session
                ));
              }}
            />
          </Layout>
        } />

        <Route path="/incubation" element={
          <Layout 
            sidebarOpen={sidebarOpen} 
            onCloseSidebar={setSidebarOpen}
            onLogout={() => {}}
          >
            <IncubationDashboard 
              sessions={sessions}
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />
          </Layout>
        } />

        <Route path="/incubation/new" element={
          <Layout 
            sidebarOpen={sidebarOpen} 
            onCloseSidebar={setSidebarOpen}
            onLogout={() => {}}
          >
            <CreateIncubationBatch 
              sessions={sessions}
              onCreateBatch={(sessionIds) => {
                const batchId = Date.now().toString();
                setSessions(prev => prev.map(session =>
                  sessionIds.includes(session.id)
                    ? { ...session, incubationBatchId: batchId }
                    : session
                ));
                return batchId;
              }}
            />
          </Layout>
        } />

        <Route path="/incubation/:incubationSessionId/assign-incubator" element={
          <Layout 
            sidebarOpen={sidebarOpen} 
            onCloseSidebar={setSidebarOpen}
            onLogout={() => {}}
          >
            <IncubatorAssignmentPage 
              currentUser={currentUser}
              onAssignIncubator={(id, details) => {
                setSessions(prev => prev.map(session =>
                  session.id === id
                    ? { ...session, incubatorAssignment: details }
                    : session
                ));
              }}
            />
          </Layout>
        } />

        <Route path="/incubation/:incubationSessionId/monitoring/stage/:stage" element={
          <Layout 
            sidebarOpen={sidebarOpen} 
            onCloseSidebar={setSidebarOpen}
            onLogout={() => {}}
          >
            <IncubationMonitoringPage 
              currentUser={currentUser}
              onUpdateIncubation={(id, details) => {
                setSessions(prev => prev.map(session =>
                  session.id === id
                    ? { ...session, ...details }
                    : session
                ));
              }}
            />
          </Layout>
        } />

        <Route path="/incubation/:incubationSessionId/stage2-setup" element={
          <Layout 
            sidebarOpen={sidebarOpen} 
            onCloseSidebar={setSidebarOpen}
            onLogout={() => {}}
          >
            <Stage2SetupPage 
              currentUser={currentUser}
              onStartStage2={(id, details) => {
                setSessions(prev => prev.map(session =>
                  session.id === id
                    ? { ...session, stage2Setup: details }
                    : session
                ));
              }}
            />
          </Layout>
        } />
      </Routes>
    </Router>
  );
};

export default App;