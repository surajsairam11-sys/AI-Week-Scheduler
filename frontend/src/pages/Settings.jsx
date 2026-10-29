import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';

const Settings = () => {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    name: 'User',
    email: '',
    darkMode: false,
    notifications: true,
  });

  const handleSave = (e) => {
    e.preventDefault();
    // Persist to localStorage
    localStorage.setItem('app_settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Load from localStorage on mount
  React.useEffect(() => {
    const s = localStorage.getItem('app_settings');
    if (s) {
      try { setSettings(JSON.parse(s)); } catch { /* ignore */ }
    }
  }, []);

  return (
    <div>
      <h2 className="mb-4">⚙️ Settings</h2>

      {saved && <Alert variant="success">Settings saved!</Alert>}

      <Card className="shadow-sm" style={{ maxWidth: 600 }}>
        <Card.Body>
          <Form onSubmit={handleSave}>
            <Form.Group className="mb-3">
              <Form.Label>Display Name</Form.Label>
              <Form.Control
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              />
            </Form.Group>
            <Form.Check
              className="mb-3"
              type="switch"
              label="Dark Mode (coming soon)"
              checked={settings.darkMode}
              onChange={(e) => setSettings({ ...settings, darkMode: e.target.checked })}
            />
            <Form.Check
              className="mb-3"
              type="switch"
              label="Enable Notifications"
              checked={settings.notifications}
              onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
            />
            <Button type="submit" variant="primary">Save Settings</Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Settings;
