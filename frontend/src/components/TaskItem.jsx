import React, { useState } from 'react';
import { apiFetch } from '../services/api.js';

/**
 * Displays a single task with options to edit, delete and toggle status.
 *
 * When editing, the form fields allow updating the title, description,
 * priority, status and due date. Updates are sent to the server and the
 * parent dashboard is notified via callback props.
 */
function TaskItem({ task, onTaskUpdated, onTaskDeleted }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState({ ...task });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handles toggling the completion status of a task
  const toggleStatus = async () => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      const res = await apiFetch(`/api/tasks/${task._id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      }, true);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Unable to update task');
      onTaskUpdated(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Handles deletion of a task
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      const res = await apiFetch(`/api/tasks/${task._id}`, {
        method: 'DELETE',
      }, true);
      if (!res.ok && res.status !== 204) {
        const data = await res.json();
        throw new Error(data.message || 'Unable to delete task');
      }
      onTaskDeleted(task._id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditToggle = () => {
    setError(null);
    setIsEditing((prev) => !prev);
    setFormState({ ...task });
  };

  // Handles saving edits to the task
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch(`/api/tasks/${task._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: formState.title,
          description: formState.description,
          priority: formState.priority,
          status: formState.status,
          dueDate: formState.dueDate || null,
        }),
      }, true);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Unable to update task');
      setIsEditing(false);
      onTaskUpdated(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Input change handler for controlled inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white p-4 rounded shadow-md mb-4">
      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-3">
          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formState.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              value={formState.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 font-medium">Priority</label>
              <select
                name="priority"
                value={formState.priority}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-2 py-1"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Status</label>
              <select
                name="status"
                value={formState.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-2 py-1"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formState.dueDate ? formState.dueDate.split('T')[0] : ''}
                onChange={(e) =>
                  handleChange({
                    target: { name: 'dueDate', value: e.target.value },
                  })
                }
                className="w-full border border-gray-300 rounded px-2 py-1"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleEditToggle}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-indigo-400"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold mb-1">
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm mb-1 text-gray-700">
                  {task.description}
                </p>
              )}
              <div className="text-sm text-gray-600 space-x-2">
                <span>
                  Priority: <strong>{task.priority}</strong>
                </span>
                {task.dueDate && (
                  <span>
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={toggleStatus}
                className={`px-3 py-1 rounded text-white ${
                  task.status === 'completed'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-yellow-500 hover:bg-yellow-600'
                }`}
              >
                {task.status === 'completed' ? 'Mark Pending' : 'Mark Done'}
              </button>
              <button
                onClick={handleEditToggle}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskItem;