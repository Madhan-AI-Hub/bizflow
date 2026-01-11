import api from './api';

export const analyticsService = {
  getDashboardStats: async () => {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },

  getRevenueByPeriod: async (period = 'daily', days = 7) => {
    const response = await api.get(`/analytics/revenue?period=${period}&days=${days}`);
    return response.data;
  },

  getTopCustomers: async (limit = 5) => {
    const response = await api.get(`/analytics/top-customers?limit=${limit}`);
    return response.data;
  },

  getTopProducts: async (limit = 5) => {
    const response = await api.get(`/analytics/top-products?limit=${limit}`);
    return response.data;
  },

  getExpensesByCategory: async () => {
    const response = await api.get('/analytics/expenses-by-category');
    return response.data;
  }
};
