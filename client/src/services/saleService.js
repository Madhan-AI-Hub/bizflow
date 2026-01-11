import api from './api';

export const saleService = {
  getSales: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/sales?${query}`);
    return response.data;
  },

  getSaleById: async (id) => {
    const response = await api.get(`/sales/${id}`);
    return response.data;
  },

  createSale: async (data) => {
    const response = await api.post('/sales', data);
    return response.data;
  },

  updateSale: async (id, data) => {
    const response = await api.put(`/sales/${id}`, data);
    return response.data;
  },

  deleteSale: async (id) => {
    const response = await api.delete(`/sales/${id}`);
    return response.data;
  }
};
