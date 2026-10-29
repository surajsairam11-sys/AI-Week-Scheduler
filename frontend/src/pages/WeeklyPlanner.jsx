import React, { useState, useEffect } from 'react';
import { Card, Badge, Row, Col, Button, Spinner } from 'react-bootstrap';
import { getTasks } from '../services/api';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const STATUS_COLORS = { pending: 'secondary', 'in-progress': 'info', completed: 'success' };

function getWeekDates(offset = 0) {
  const now = new Date();
  const day = now.getDay() || 7; // Mon = 1
  const mon = new Date(now);
  mon.setDate(now.getDate() - day + 1 + offset * 7);
  return DAYS.map((_, i) => {
    const d = new Date(mon);
    d.setDate(mon.getDate() + i);
    return d;
  });
}

const WeeklyPlanner = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);

  useEffect(() => {
    setLoading(true);
    getTasks()
      .then((r) => setTasks(r.data))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  }, []);

  const dates = getWeekDates(weekOffset);

  const tasksByDay = DAYS.map((_, i) => {
    const dateStr = dates[i].toISOString().slice(0, 10);
    return tasks.filter((t) => t.dueDate?.slice(0, 10) === dateStr);
  });

  const weekLabel = `${dates[0].toLocaleDateString()} – ${dates[6].toLocaleDateString()}`;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📅 Weekly Planner</h2>
        <div>
          <Button size="sm" variant="outline-primary" className="me-2" onClick={() => setWeekOffset((w) => w - 1)}>← Prev</Button>
          <Button size="sm" variant="outline-secondary" className="me-2" onClick={() => setWeekOffset(0)}>Today</Button>
          <Button size="sm" variant="outline-primary" onClick={() => setWeekOffset((w) => w + 1)}>Next →</Button>
        </div>
      </div>
      <p className="text-muted mb-3">{weekLabel}</p>

      <Row className="g-3">
        {DAYS.map((day, i) => {
          const isToday = dates[i].toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10);
          return (
            <Col key={day} xs={12} md={6} lg={4} xl={3}>
              <Card className={`shadow-sm h-100 ${isToday ? 'border-primary border-2' : ''}`}>
                <Card.Header className={`${isToday ? 'bg-primary text-white' : 'bg-light'}`}>
                  <strong>{day}</strong>
                  <small className="ms-2">{dates[i].toLocaleDateString()}</small>
                </Card.Header>
                <Card.Body style={{ minHeight: 120 }}>
                  {tasksByDay[i].length === 0 ? (
                    <p className="text-muted small">No tasks</p>
                  ) : (
                    tasksByDay[i].map((t) => (
                      <div key={t._id || t.id} className="mb-2 p-2 bg-light rounded">
                        <div className="d-flex justify-content-between">
                          <span className="small fw-semibold">{t.title}</span>
                          <Badge bg={STATUS_COLORS[t.status]} className="ms-1">{t.status}</Badge>
                        </div>
                      </div>
                    ))
                  )}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default WeeklyPlanner;
