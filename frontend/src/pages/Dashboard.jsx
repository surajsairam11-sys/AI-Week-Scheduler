import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, ProgressBar, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getTasks } from '../services/api';

const PRIORITY_COLORS = { high: 'danger', medium: 'warning', low: 'success' };

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTasks()
      .then((r) => setTasks(r.data))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  }, []);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const pending = tasks.filter((t) => t.status === 'pending').length;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const todayTasks = tasks.filter((t) => t.dueDate?.slice(0, 10) === todayStr);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">📊 Dashboard</h2>

      {/* Summary cards */}
      <Row className="g-3 mb-4">
        {[
          { title: 'Total Tasks', value: total, bg: 'primary' },
          { title: 'Completed', value: completed, bg: 'success' },
          { title: 'In Progress', value: inProgress, bg: 'info' },
          { title: 'Pending', value: pending, bg: 'warning' },
        ].map((c) => (
          <Col key={c.title} xs={6} md={3}>
            <Card className={`text-white bg-${c.bg} shadow-sm`}>
              <Card.Body className="text-center">
                <h5>{c.title}</h5>
                <h2>{c.value}</h2>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Overall progress */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h5>Overall Progress</h5>
          <ProgressBar now={pct} label={`${pct}%`} variant="success" />
        </Card.Body>
      </Card>

      {/* Today's tasks */}
      <Card className="shadow-sm">
        <Card.Body>
          <h5>Today's Tasks ({todayTasks.length})</h5>
          {todayTasks.length === 0 ? (
            <p className="text-muted">No tasks scheduled for today. <Link to="/tasks">Create one →</Link></p>
          ) : (
            todayTasks.map((t) => (
              <div key={t._id || t.id} className="d-flex justify-content-between align-items-center border-bottom py-2">
                <span>{t.title}</span>
                <Badge bg={PRIORITY_COLORS[t.priority] || 'secondary'}>{t.priority}</Badge>
              </div>
            ))
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Dashboard;
