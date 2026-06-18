const Task = require('../models/Task');

/**
 * Retrieves all tasks belonging to the authenticated user.
 *
 * Tasks are sorted by creation date descending so that the most recently
 * created tasks appear first. Only tasks associated with the current user
 * (identified via `req.user._id`) are returned.
 */
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Creates a new task for the authenticated user.
 *
 * The request body should include at least a `title`. Optional fields
 * include `description`, `status`, `priority`, and `dueDate`. If the
 * title is missing a 400 response is returned.
 */
const createTask = async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }
  try {
    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      status,
      priority,
      dueDate,
    });
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Updates an existing task.
 *
 * The task ID is provided via the URL parameter. Only tasks belonging to
 * the authenticated user may be updated. Any fields present in the body
 * are updated. If no task is found a 404 response is returned.
 */
const updateTask = async (req, res) => {
  const { id } = req.params;
  try {
    let task = await Task.findOne({ _id: id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const updates = req.body;
    task = Object.assign(task, updates);
    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Deletes a task.
 *
 * The task ID is provided via the URL parameter. Only tasks belonging
 * to the authenticated user may be deleted. If the task is not found a
 * 404 response is returned. On success a 204 response is sent.
 */
const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findOneAndDelete({ _id: id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};