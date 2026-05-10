import api from '../api';

export interface OrderData {
  items: any[];
  totalAmount: number;
  shippingAddress: any;
  paymentMethod: string;
}

export const createOrder = async (orderData: OrderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const getUserOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

export const getAllOrders = async () => {
  const response = await api.get('/orders/all');
  return response.data;
};
