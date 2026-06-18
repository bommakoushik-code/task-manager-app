import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';

// A simple navigation bar that displays links based on authentication state.
function Navbar({ user, onLogout }) {
  return (
    <nav className="bg-white shadow-md py-4 mb-6">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-600">Task Manager</h1>
        <div className="space-x-4">
          {!user ? (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-indigo-600 font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-gray-700 hover:text-indigo-600 font-medium"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="text-gray-700 font-medium">
                Hi, {user.username}
              </span>
              <button
                onClick={onLogout}
                className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } catch {
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div>
      <Navbar user={user} onLogout={handleLogout} />
      <div className="container mx-auto px-4">
        <Routes>
          <Route
            path="/"
            element={<Navigate to={user ? '/dashboard' : '/login'} replace />}
          />
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Login onLogin={setUser} />
              )
            }
          />
          <Route
            path="/register"
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Register onRegister={setUser} />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              user ? (
                <Dashboard user={user} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;