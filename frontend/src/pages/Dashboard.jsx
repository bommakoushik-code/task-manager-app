import React, { useEffect, useState } from 'react';
import TaskForm from '../components/TaskForm.jsx';
import TaskItem from '../components/TaskItem.jsx';
import { apiFetch } from '../services/api.js';

/**
 * Dashboard page component.
 *
 * Fetches tasks for the authenticated user on mount and renders a form to
 * create new tasks along with a list of existing tasks. It handles
 * updating and deleting tasks via callbacks passed to child components.
 */
function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await apiFetch('/api/tasks', { method: 'GET' }, true);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Unable to fetch tasks');
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Adds a newly created task to state
  const handleTaskCreated = (task) => {
    setTasks((prev) => [task, ...prev]);
  };

  // Updates an existing task in state
  const handleTaskUpdated = (updated) => {
    setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
  };

  // Removes a deleted task from state
  const handleTaskDeleted = (id) => {
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  if (loading) {
    return <p className="text-center">Loading tasks...</p>;
  }
  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }
  return (
    <div>
      <TaskForm onTaskCreated={handleTaskCreated} />
      <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
      {tasks.length === 0 ? (
        <p>You have no tasks yet. Create one above!</p>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            onTaskUpdated={handleTaskUpdated}
            onTaskDeleted={handleTaskDeleted}
          />
        ))
      )}
    </div>
  );
}

export default Dashboard;