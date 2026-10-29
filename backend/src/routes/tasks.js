// src/routes/tasks.js
const express = require('express');
const router = express.Router();

// In-memory fallback when MongoDB is not connected
let memoryTasks = [];
let memoryIdCounter = 1;

function getModel() {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
      return require('../models/task');
    }
  } catch { /* fall through */ }
  return null;
}

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks
 *     responses:
 *       200:
 *         description: Array of tasks
 */
router.get('/', async (req, res) => {
  try {
    const Task = getModel();
    if (Task) {
      const tasks = await Task.find().sort({ createdAt: -1 });
      return res.json(tasks);
    }
    return res.json(memoryTasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a task
 */
router.post('/', async (req, res) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const Task = getModel();
    if (Task) {
      const task = await Task.create({ title, description, priority, status, dueDate: dueDate || null });
      return res.status(201).json(task);
    }

    const task = {
      id: String(memoryIdCounter++),
      _id: String(memoryIdCounter - 1),
      title, description: description || '', priority: priority || 'medium',
      status: status || 'pending', dueDate: dueDate || null,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    memoryTasks.unshift(task);
    return res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task
 */
router.put('/:id', async (req, res) => {
  try {
    const Task = getModel();
    if (Task) {
      const task = await Task.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: Date.now() }, { new: true });
      if (!task) return res.status(404).json({ error: 'Not found' });
      return res.json(task);
    }

    const idx = memoryTasks.findIndex((t) => t.id === req.params.id || t._id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    memoryTasks[idx] = { ...memoryTasks[idx], ...req.body, updatedAt: new Date().toISOString() };
    return res.json(memoryTasks[idx]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 */
router.delete('/:id', async (req, res) => {
  try {
    const Task = getModel();
    if (Task) {
      const task = await Task.findByIdAndDelete(req.params.id);
      if (!task) return res.status(404).json({ error: 'Not found' });
      return res.json({ message: 'Deleted' });
    }

    const idx = memoryTasks.findIndex((t) => t.id === req.params.id || t._id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    memoryTasks.splice(idx, 1);
    return res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
