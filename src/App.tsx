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
import { SignInPage } from './components/auth/SignInPage';
import { SignUpPage } from './components/auth/SignUpPage';
import { DEMO_SESSIONS } from './data/demo';
import { MonitoringSession, SessionStartDetails } from './types/monitoring';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Set to true for demo
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessions, setSessions] = useState<MonitoringSession[]>(DEMO_SESSIONS);
  const [currentUser] = useState({ id: '1', name: 'John Doe' });

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSidebarOpen(false);
  };

  const handleCloseSidebar = (state: boolean) => {
    setSidebarOpen(state);
  };

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

  const handleScheduledSessions = (newSessions: MonitoringSession[]) => {
    setSessions(prev => [...prev, ...newSessions]);
  };

  const handleStorageComplete = (sessionId: string, storageDetails: any) => {
    setSessions(prev => prev.map(session =>
      session.id === sessionId
        ? { ...session, negativeControlStorage: storageDetails }
        : session
    ));
  };

  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/signin" />;
    }
    return <>{children}</>;
  };

  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignInPage onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignUpPage />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout 
              sidebarOpen={sidebarOpen} 
              onCloseSidebar={handleCloseSidebar}
              onLogout={handleLogout}
            >
              <MonitoringDashboard 
                sessions={sessions}
              />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/scheduler" element={
          <ProtectedRoute>
            <Layout 
              sidebarOpen={sidebarOpen} 
              onCloseSidebar={handleCloseSidebar}
              onLogout={handleLogout}
            >
              <SchedulerPage 
                onScheduledSessions={handleScheduledSessions}
                sessions={sessions}
              />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/sessions" element={
          <ProtectedRoute>
            <Layout 
              sidebarOpen={sidebarOpen} 
              onCloseSidebar={handleCloseSidebar}
              onLogout={handleLogout}
            >
              <SessionsPage
                sessions={sessions}
                onCreateSession={handleCreateSession}
                onStartSession={handleStartSession}
              />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/sessions/:sessionId/details" element={
          <ProtectedRoute>
            <Layout 
              sidebarOpen={sidebarOpen} 
              onCloseSidebar={handleCloseSidebar}
              onLogout={handleLogout}
            >
              <SessionDetailsPage sessions={sessions} />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/sessions/:sessionId/verify-media" element={
          <ProtectedRoute>
            <Layout 
              sidebarOpen={sidebarOpen} 
              onCloseSidebar={handleCloseSidebar}
              onLogout={handleLogout}
            >
              <MediaVerificationPage 
                sessions={sessions}
                onStartSession={handleStartSession}
              />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/sessions/:sessionId/store-controls" element={
          <ProtectedRoute>
            <Layout 
              sidebarOpen={sidebarOpen} 
              onCloseSidebar={handleCloseSidebar}
              onLogout={handleLogout}
            >
              <NegativeControlStoragePage 
                sessions={sessions}
                onStorageComplete={handleStorageComplete}
              />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/sessions/:sessionId/execute" element={
          <ProtectedRoute>
            <Layout 
              sidebarOpen={sidebarOpen} 
              onCloseSidebar={handleCloseSidebar}
              onLogout={handleLogout}
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
          </ProtectedRoute>
        } />

        <Route path="/sessions/:sessionId/incubation" element={
          <ProtectedRoute>
            <Layout 
              sidebarOpen={sidebarOpen} 
              onCloseSidebar={handleCloseSidebar}
              onLogout={handleLogout}
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
          </ProtectedRoute>
        } />

        <Route path="/incubation" element={
          <ProtectedRoute>
            <Layout 
              sidebarOpen={sidebarOpen} 
              onCloseSidebar={handleCloseSidebar}
              onLogout={handleLogout}
            >
              <IncubationDashboard 
                sessions={sessions}
                onToggleSidebar={() => handleCloseSidebar(!sidebarOpen)}
              />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/incubation/new" element={
          <ProtectedRoute>
            <Layout 
              sidebarOpen={sidebarOpen} 
              onCloseSidebar={handleCloseSidebar}
              onLogout={handleLogout}
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
          </ProtectedRoute>
        } />

        <Route path="/incubation/:incubationSessionId/assign-incubator" element={
          <ProtectedRoute>
            <Layout 
              sidebarOpen={sidebarOpen} 
              onCloseSidebar={handleCloseSidebar}
              onLogout={handleLogout}
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
          </ProtectedRoute>
        } />

        <Route path="/incubation/:incubationSessionId/monitoring/stage/:stage" element={
          <ProtectedRoute>
            <Layout 
              sidebarOpen={sidebarOpen} 
              onCloseSidebar={handleCloseSidebar}
              onLogout={handleLogout}
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
          </ProtectedRoute>
        } />

        <Route path="/incubation/:incubationSessionId/stage2-setup" element={
          <ProtectedRoute>
            <Layout 
              sidebarOpen={sidebarOpen} 
              onCloseSidebar={handleCloseSidebar}
              onLogout={handleLogout}
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
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;