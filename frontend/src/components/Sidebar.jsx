import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/tasks', label: 'My Tasks' },
    { path: '/planner', label: 'Weekly Planner' },
    { path: '/ai', label: 'AI Recommendations' },
    { path: '/reports', label: 'Progress Reports' },
    { path: '/settings', label: 'Settings' },
  ];

  return (
    <Nav className="flex-column bg-dark text-white p-3" style={{ width: '200px', minHeight: '100vh' }}>
      {navItems.map((item) => (
        <Nav.Item key={item.path} className="mb-2">
          <Link
            to={item.path}
            className={`nav-link text-white ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.label}
          </Link>
        </Nav.Item>
      ))}
    </Nav>
  );
};

export default Sidebar;
