// Centralized helper for API requests.
// This module reads the API base URL from the VITE_API_URL environment variable
// and automatically includes the authentication token in the Authorization header
// for protected requests.

const API_URL = import.meta.env.VITE_API_URL || '';

/**
 * Wrapper around fetch for making HTTP requests to the backend API.
 *
 * @param {string} endpoint The API endpoint (relative to API_URL).
 * @param {Object} options Additional fetch options (method, headers, body, etc.).
 * @param {boolean} auth Whether to include the Authorization header (default: false).
 * @returns {Promise<Response>} The fetch response.
 */
export async function apiFetch(endpoint, options = {}, auth = false) {
  const headers = options.headers || {};
  headers['Content-Type'] = 'application/json';

  if (auth) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const { token } = JSON.parse(storedUser);
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      } catch {
        // ignore JSON parse errors
      }
    }
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  return res;
}