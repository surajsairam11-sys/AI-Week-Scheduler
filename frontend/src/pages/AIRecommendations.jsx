import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Badge, Spinner, Alert, Button } from 'react-bootstrap';
import { getTasks } from '../services/api';

/* Simple client-side AI-style recommendations based on current tasks */
function generateRecommendations(tasks) {
  const recs = [];

  const overdue = tasks.filter(
    (t) => t.status !== 'completed' && t.dueDate && new Date(t.dueDate) < new Date()
  );
  if (overdue.length > 0) {
    recs.push({
      type: 'warning',
      title: `⚠️ ${overdue.length} overdue task(s)`,
      text: `Tasks "${overdue.map((t) => t.title).join('", "')}" are past due. Consider rescheduling or completing them today.`,
    });
  }

  const highPending = tasks.filter((t) => t.priority === 'high' && t.status === 'pending');
  if (highPending.length > 0) {
    recs.push({
      type: 'danger',
      title: '🔴 High-priority tasks waiting',
      text: `You have ${highPending.length} high-priority task(s) that haven't been started yet. Focus on these first!`,
    });
  }

  const inProgress = tasks.filter((t) => t.status === 'in-progress');
  if (inProgress.length > 3) {
    recs.push({
      type: 'info',
      title: '🔄 Too many tasks in progress',
      text: `You have ${inProgress.length} tasks in progress. Try to finish some before starting new ones.`,
    });
  }

  const completed = tasks.filter((t) => t.status === 'completed').length;
  const total = tasks.length;
  if (total > 0 && completed / total >= 0.8) {
    recs.push({
      type: 'success',
      title: '🎉 Great progress!',
      text: `You've completed ${completed} of ${total} tasks (${Math.round((completed / total) * 100)}%). Keep it up!`,
    });
  }

  const noDue = tasks.filter((t) => !t.dueDate && t.status !== 'completed');
  if (noDue.length > 0) {
    recs.push({
      type: 'secondary',
      title: '📅 Tasks without due dates',
      text: `${noDue.length} task(s) have no due date. Setting deadlines improves focus.`,
    });
  }

  if (recs.length === 0) {
    recs.push({
      type: 'success',
      title: '✅ Everything looks great!',
      text: total === 0
        ? 'No tasks yet — add some to get personalised recommendations.'
        : 'Your workload is well-balanced. Nice job!',
    });
  }

  return recs;
}

const AIRecommendations = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recs, setRecs] = useState([]);

  const analyse = (t) => { setRecs(generateRecommendations(t)); };

  useEffect(() => {
    getTasks()
      .then((r) => { setTasks(r.data); analyse(r.data); })
      .catch(() => { setTasks([]); analyse([]); })
      .finally(() => setLoading(false));
  }, []);

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
        <h2>🤖 AI Recommendations</h2>
        <Button size="sm" variant="outline-primary" onClick={() => analyse(tasks)}>Refresh</Button>
      </div>

      {recs.map((r, i) => (
        <Alert key={i} variant={r.type} className="shadow-sm">
          <Alert.Heading className="h6">{r.title}</Alert.Heading>
          <p className="mb-0">{r.text}</p>
        </Alert>
      ))}

      <Card className="mt-4 shadow-sm">
        <Card.Body>
          <h5 className="mb-3">Task Breakdown</h5>
          <ListGroup variant="flush">
            <ListGroup.Item className="d-flex justify-content-between">
              <span>Pending</span>
              <Badge bg="secondary">{tasks.filter((t) => t.status === 'pending').length}</Badge>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between">
              <span>In Progress</span>
              <Badge bg="info">{tasks.filter((t) => t.status === 'in-progress').length}</Badge>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between">
              <span>Completed</span>
              <Badge bg="success">{tasks.filter((t) => t.status === 'completed').length}</Badge>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AIRecommendations;
