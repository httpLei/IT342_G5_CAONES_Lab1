import api from './authService';

export const transactionService = {
  createTransaction: async (transactionData) => {
    const response = await api.post('/transactions', transactionData);
    return response.data;
  },

  getAllTransactions: async () => {
    const response = await api.get('/transactions');
    return response.data;
  },

  getCurrentMonthTransactions: async () => {
    const response = await api.get('/transactions/current-month');
    return response.data;
  },

  updateTransaction: async (id, transactionData) => {
    const response = await api.put(`/transactions/${id}`, transactionData);
    return response.data;
  },

  deleteTransaction: async (id) => {
    await api.delete(`/transactions/${id}`);
  }
};
