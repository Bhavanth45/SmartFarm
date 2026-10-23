const resolveApiBase = () => {
  const envUrl = import.meta.env?.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string') {
    let clean = envUrl.trim().replace(/^\[(.*?)\]\(.*?\)$/, '$1').replace(/['"]/g, '');
    clean = clean.replace(/\/+$/, '');
    if (!clean.endsWith('/api')) clean += '/api';
    return clean;
  }
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:5000/api';
  }
  return 'https://smartfarm-backend-tdo9.onrender.com/api';
};

export const API_BASE = resolveApiBase();

// Helper to get JWT token from localStorage
const getHeaders = () => {
  const token = localStorage.getItem('smartfarm_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // System Health
  getHealth: async () => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (!res.ok) return { success: false, offline: true, status: res.status };
      return await res.json();
    } catch (err) {
      console.warn('Backend health check error:', err);
      return { success: false, offline: true, error: err.message };
    }
  },

  // Auth
  login: async (identifier, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });
      return await res.json();
    } catch (err) {
      console.warn('Backend server not reachable, using offline mode:', err);
      return { success: false, offline: true, message: err.message };
    }
  },

  register: async (userData) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return await res.json();
    } catch (err) {
      console.warn('Backend server not reachable, using offline mode:', err);
      return { success: false, offline: true, message: err.message };
    }
  },

  getMe: async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, { headers: getHeaders() });
      return await res.json();
    } catch (err) {
      return { success: false, offline: true };
    }
  },

  // Fields
  getFields: async () => {
    try {
      const res = await fetch(`${API_BASE}/fields`, { headers: getHeaders() });
      return await res.json();
    } catch (err) {
      return { success: false, offline: true };
    }
  },

  waterField: async (fieldId) => {
    try {
      const res = await fetch(`${API_BASE}/fields/${fieldId}/water`, {
        method: 'POST',
        headers: getHeaders()
      });
      return await res.json();
    } catch (err) {
      return { success: false, offline: true };
    }
  },

  createField: async (fieldData) => {
    try {
      const res = await fetch(`${API_BASE}/fields`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(fieldData)
      });
      return await res.json();
    } catch (err) {
      return { success: false, offline: true };
    }
  },

  deleteField: async (fieldId) => {
    try {
      const res = await fetch(`${API_BASE}/fields/${fieldId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return await res.json();
    } catch (err) {
      return { success: false, offline: true };
    }
  },

  updateFieldPrice: async (fieldId, price) => {
    try {
      const res = await fetch(`${API_BASE}/fields/${fieldId}/price`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ price })
      });
      return await res.json();
    } catch (err) {
      return { success: false, offline: true };
    }
  },

  // Tasks
  getTasks: async (fieldId) => {
    try {
      const url = fieldId ? `${API_BASE}/tasks?fieldId=${fieldId}` : `${API_BASE}/tasks`;
      const res = await fetch(url, { headers: getHeaders() });
      return await res.json();
    } catch (err) {
      return { success: false, offline: true };
    }
  },

  createTask: async (taskData) => {
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(taskData)
      });
      return await res.json();
    } catch (err) {
      return { success: false, offline: true };
    }
  },

  toggleTask: async (taskId) => {
    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}/toggle`, {
        method: 'PATCH',
        headers: getHeaders()
      });
      return await res.json();
    } catch (err) {
      return { success: false, offline: true };
    }
  },

  deleteTask: async (taskId) => {
    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return await res.json();
    } catch (err) {
      return { success: false, offline: true };
    }
  },

  // Analytics
  getAnalytics: async (fieldId) => {
    try {
      const res = await fetch(`${API_BASE}/analytics/${fieldId}`, { headers: getHeaders() });
      return await res.json();
    } catch (err) {
      return { success: false, offline: true };
    }
  },

  // Orders
  getOrders: async () => {
    try {
      const res = await fetch(`${API_BASE}/orders`, { headers: getHeaders() });
      return await res.json();
    } catch (err) {
      return { success: false, offline: true };
    }
  },

  createOrder: async (orderData) => {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(orderData)
      });
      return await res.json();
    } catch (err) {
      return { success: false, offline: true };
    }
  }
};

