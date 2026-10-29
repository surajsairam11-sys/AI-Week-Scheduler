import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import MyTasks from './pages/MyTasks';
import WeeklyPlanner from './pages/WeeklyPlanner';
import AIRecommendations from './pages/AIRecommendations';
import ProgressReports from './pages/ProgressReports';
import Settings from './pages/Settings';

const App = () => {
  return (
    <Router>
      <Container fluid className="p-0 min-vh-100 d-flex">
        <Sidebar />
        <Col className="p-4 bg-light flex-grow-1" style={{ overflowY: 'auto' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<MyTasks />} />
            <Route path="/planner" element={<WeeklyPlanner />} />
            <Route path="/ai" element={<AIRecommendations />} />
            <Route path="/reports" element={<ProgressReports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Col>
      </Container>
    </Router>
  );
};

export default App;
