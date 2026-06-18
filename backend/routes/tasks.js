const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

// All routes in this file are protected; the user must be authenticated.
router.use(protect);

// @route   GET /api/tasks
// @desc    Get all tasks for the authenticated user
router.get('/', getTasks);

// @route   POST /api/tasks
// @desc    Create a new task
router.post('/', createTask);

// @route   PUT /api/tasks/:id
// @desc    Update a task
router.put('/:id', updateTask);

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
router.delete('/:id', deleteTask);

module.exports = router;