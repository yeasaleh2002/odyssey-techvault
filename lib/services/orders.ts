import api from '../api';

export const getMyOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

export const getAllOrders = async () => {
  const response = await api.get('/orders/all');
  return response.data;
};

export const getOrderById = async (id: string) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const createOrder = async (data: any) => {
  const response = await api.post('/orders', data);
  return response.data;
};

export const updateOrderStatus = async (id: string, orderStatus: string) => {
  const response = await api.put(`/orders/${id}/status`, { orderStatus });
  return response.data;
};

export const cancelOrder = async (id: string) => {
  const response = await api.put(`/orders/${id}/cancel`);
  return response.data;
};
