// Centralized API configuration for Choice Icon Schools
const API_BASE_URL = "https://choice-icon-schools.vercel.app/api";

// Centralized API functions for all endpoints
export const api = {
  // Authentication
  login: async (credentials: { email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  getAuthMe: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  // Form submissions
  submitContact: async (data: { name: string; email: string; phone: string; message: string }) => {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  submitAdmission: async (data: { name: string; email: string; phone: string; message: string }) => {
    const response = await fetch(`${API_BASE_URL}/admission`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  submitFeedback: async (data: { name: string; phone: string; email?: string; message: string }) => {
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  submitCareerApplication: async (formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/career-upload`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  // Admin dashboard endpoints
  getStats: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getEnquiries: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/enquiries`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  deleteEnquiry: async (id: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/enquiries/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getAdmissions: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/admissions`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  updateAdmission: async (id: string, data: { status: string }, token: string) => {
    const response = await fetch(`${API_BASE_URL}/admissions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  deleteAdmission: async (id: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/admissions/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getJobs: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  getBlogPosts: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/blog`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  createBlogPost: async (data: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  updateBlogPost: async (id: string, data: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  deleteBlogPost: async (id: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  // Public endpoints (no auth required)
  getAnnouncements: async () => {
    const response = await fetch(`${API_BASE_URL}/announcements`);
    return response.json();
  },

  getSettings: async () => {
    const response = await fetch(`${API_BASE_URL}/settings`);
    return response.json();
  },

  getEvents: async () => {
    const response = await fetch(`${API_BASE_URL}/events`);
    return response.json();
  },

  getGallery: async () => {
    const response = await fetch(`${API_BASE_URL}/gallery`);
    return response.json();
  },

  // Health check
  getHealth: async () => {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    return response.json();
  },
};

// Export API_BASE_URL for direct usage if needed
export { API_BASE_URL };
