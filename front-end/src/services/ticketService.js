import axios from 'axios';

const API_URL = 'http://localhost:8080/api/tickets';

const ticketService = {
  createTicket: async (ticketData) => {
    const formData = new FormData();
    formData.append('resourceLocation', ticketData.resourceLocation);
    formData.append('category', ticketData.category);
    formData.append('description', ticketData.description);
    formData.append('priority', ticketData.priority);
    formData.append('preferredContactDetails', ticketData.preferredContactDetails);
    
    if (ticketData.images) {
      ticketData.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    const token = localStorage.getItem('token');
    const response = await axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },

  getAllTickets: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },

  getMyTickets: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/my`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  }
};

export default ticketService;
