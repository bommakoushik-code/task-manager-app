import React, { useState } from 'react';
import { apiFetch } from '../services/api.js';

/**
 * Component for creating a new task.
 *
 * Displays a form with fields for title, description, priority and due date. On
 * submission a POST request is sent to the backend. If successful the new
 * task is added to the parent component via onTaskCreated callback and the
 * form is reset.
 */
function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await apiFetch(
        '/api/tasks',
        {
          method: 'POST',
          body: JSON.stringify({
            title,
            description,
            priority,
            dueDate: dueDate || null,
          }),
        },
        true
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Unable to create task');
      onTaskCreated(data);
      // Reset form
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Create New Task</h3>
      {error && (
        <p className="text-red-600 text-sm mb-2">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 font-medium">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-indigo-400"
        >
          {loading ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
}

export default TaskForm;