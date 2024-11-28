import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { MonitoringDashboard } from './components/MonitoringDashboard';
import { SchedulerPage } from './components/scheduler/SchedulerPage';
import { SessionsPage } from './components/sessions/SessionsPage';
import { SessionDetailsPage } from './components/sessions/SessionDetailsPage';
import { MediaVerificationPage } from './components/sessions/MediaVerificationPage';
import { NegativeControlStoragePage } from './components/sessions/NegativeControlStoragePage';
import { SessionExecutionPage } from './components/sessions/SessionExecutionPage';
import { IncubationPage } from './components/sessions/IncubationPage';
import { IncubationDashboard } from './components/incubation/IncubationDashboard';
import { CreateIncubationBatch } from './components/incubation/CreateIncubationBatch';
import { IncubatorAssignmentPage } from './components/incubation/IncubatorAssignmentPage';
import { IncubationMonitoringPage } from './components/incubation/IncubationMonitoringPage';
import { Stage2SetupPage } from './components/incubation/Stage2SetupPage';
import { DEMO_AREAS, DEMO_ROOMS, DEMO_POINTS, DEMO_SESSIONS } from './data/demo';
import { MonitoringSession, SessionStartDetails } from './types/monitoring';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<MonitoringSession[]>(DEMO_SESSIONS);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser] = useState({ id: '1', name: 'John Doe' });

  const handleCreateSession = (sessionData: Partial<MonitoringSession>) => {
    const newSession = {
      id: `SESSION-${Date.now()}`,
      ...sessionData,
      status: 'pending',
      plates: []
    } as MonitoringSession;
    
    setSessions(prev => [...prev, newSession]);
  };

  const handleStartSession = (sessionId: string, startDetails: SessionStartDetails) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId
        ? { ...session, status: 'in-progress', startDetails }
        : session
    ));
  };

  const handleStorageComplete = (sessionId: string, storageDetails: any) => {
    setSessions(prev => prev.map(session =>
      session.id === sessionId
        ? { ...session, negativeControlStorage: storageDetails }
        : session
    ));
  };

  const handleUpdateSession = (sessionId: string, updates: Partial<MonitoringSession>) => {
    setSessions(prev => prev.map(session =>
      session.id === sessionId
        ? { ...session, ...updates }
        : session
    ));
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
            <SchedulerPage 
              sessions={sessions}
              onScheduledSessions={(newSessions) => {
                setSessions(prev => [...prev, ...newSessions]);
              }}
            />
          </Layout>
        } />

        <Route path="/sessions" element={
          <Layout 
            sidebarOpen={sidebarOpen} 
            onCloseSidebar={setSidebarOpen}
            onLogout={() => {}}
          >
            <SessionsPage
              areas={DEMO_AREAS}
              rooms={DEMO_ROOMS}
              samplingPoints={DEMO_POINTS}
              sessions={sessions}
              onCreateSession={handleCreateSession}
              onStartSession={handleStartSession}
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
              onStartSession={handleStartSession}
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
              onStorageComplete={handleStorageComplete}
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
              onUpdateSession={handleUpdateSession}
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