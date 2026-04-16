import axios from 'axios';

const API_URL = 'http://localhost:8080/api/notifications';

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

const notificationService = {
  getNotifications: async () => {
    const response = await axios.get(API_URL, { headers: authHeaders() });
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await axios.get(`${API_URL}/unread-count`, { headers: authHeaders() });
    return response.data.count;
  },

  markAsRead: async (id) => {
    await axios.patch(`${API_URL}/${id}/read`, {}, { headers: authHeaders() });
  },

  markAllAsRead: async () => {
    await axios.patch(`${API_URL}/read-all`, {}, { headers: authHeaders() });
  },

  deleteNotification: async (id) => {
    await axios.delete(`${API_URL}/${id}`, { headers: authHeaders() });
  },

  deleteAll: async () => {
    await axios.delete(API_URL, { headers: authHeaders() });
  },
};

export default notificationService;
