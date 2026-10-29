import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spinner, ProgressBar, Table } from 'react-bootstrap';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { getTasks } from '../services/api';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const ProgressReports = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTasks()
      .then((r) => setTasks(r.data))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  }, []);

  const pending = tasks.filter((t) => t.status === 'pending').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const total = tasks.length;

  const doughnutData = {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [{
      data: [pending, inProgress, completed],
      backgroundColor: ['#6c757d', '#0dcaf0', '#198754'],
    }],
  };

  const priorityCount = (p) => tasks.filter((t) => t.priority === p).length;
  const barData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [{
      label: 'Tasks by Priority',
      data: [priorityCount('high'), priorityCount('medium'), priorityCount('low')],
      backgroundColor: ['#dc3545', '#ffc107', '#198754'],
    }],
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">📈 Progress Reports</h2>

      <Row className="g-4 mb-4">
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <h5>Status Distribution</h5>
              <div style={{ maxWidth: 300, margin: '0 auto' }}>
                {total > 0 ? <Doughnut data={doughnutData} /> : <p className="text-muted text-center mt-3">No data yet</p>}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <h5>Priority Breakdown</h5>
              {total > 0 ? <Bar data={barData} options={{ responsive: true }} /> : <p className="text-muted text-center mt-3">No data yet</p>}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <h5>Completion Rate</h5>
          <ProgressBar now={total ? Math.round((completed / total) * 100) : 0} label={`${total ? Math.round((completed / total) * 100) : 0}%`} variant="success" />
          <p className="text-muted mt-2">{completed} of {total} tasks completed</p>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body>
          <h5>Recent Completed Tasks</h5>
          {completed === 0 ? (
            <p className="text-muted">No completed tasks to show.</p>
          ) : (
            <Table responsive hover size="sm">
              <thead><tr><th>Title</th><th>Priority</th><th>Due Date</th></tr></thead>
              <tbody>
                {tasks.filter((t) => t.status === 'completed').slice(0, 10).map((t) => (
                  <tr key={t._id || t.id}>
                    <td>{t.title}</td>
                    <td>{t.priority}</td>
                    <td>{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProgressReports;
