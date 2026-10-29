// src/routes/index.js
const express = require('express');
const router = express.Router();

// Task CRUD
router.use('/tasks', require('./tasks'));

// Example placeholder route
router.get('/example', (req, res) => {
  res.json({ message: 'Example route works' });
});

module.exports = router;
