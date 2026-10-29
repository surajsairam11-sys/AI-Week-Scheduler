import React, { useState, useEffect } from 'react';
import {
  Card, Table, Button, Modal, Form, Badge, Spinner, Alert,
} from 'react-bootstrap';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';

const STATUSES = ['pending', 'in-progress', 'completed'];
const PRIORITIES = ['low', 'medium', 'high'];
const STATUS_COLORS = { pending: 'secondary', 'in-progress': 'info', completed: 'success' };
const PRIORITY_COLORS = { high: 'danger', medium: 'warning', low: 'success' };

const blank = { title: '', description: '', priority: 'medium', status: 'pending', dueDate: '' };

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ...blank });

  const load = () => {
    setLoading(true);
    getTasks()
      .then((r) => { setTasks(r.data); setError(''); })
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => { setEditing(null); setForm({ ...blank }); setShow(true); };
  const openEdit = (t) => {
    setEditing(t._id || t.id);
    setForm({
      title: t.title,
      description: t.description || '',
      priority: t.priority,
      status: t.status,
      dueDate: t.dueDate ? t.dueDate.slice(0, 10) : '',
    });
    setShow(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await updateTask(editing, form);
      } else {
        await createTask(form);
      }
      setShow(false);
      load();
    } catch (e) {
      setError(e.response?.data?.error || 'Save failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      load();
    } catch {
      setError('Delete failed');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📝 My Tasks</h2>
        <Button variant="primary" onClick={openNew}>+ New Task</Button>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : tasks.length === 0 ? (
        <Card className="shadow-sm text-center p-5">
          <p className="text-muted">No tasks yet. Click <strong>+ New Task</strong> to get started!</p>
        </Card>
      ) : (
        <Card className="shadow-sm">
          <Table responsive hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Due Date</th>
                <th style={{ width: 140 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t._id || t.id}>
                  <td>{t.title}</td>
                  <td><Badge bg={PRIORITY_COLORS[t.priority]}>{t.priority}</Badge></td>
                  <td><Badge bg={STATUS_COLORS[t.status]}>{t.status}</Badge></td>
                  <td>{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '—'}</td>
                  <td>
                    <Button size="sm" variant="outline-primary" className="me-1" onClick={() => openEdit(t)}>Edit</Button>
                    <Button size="sm" variant="outline-danger" onClick={() => handleDelete(t._id || t.id)}>Del</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}

      {/* Create / Edit modal */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? 'Edit Task' : 'New Task'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave} disabled={!form.title.trim()}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyTasks;
