import api from '../api';

export const getProducts = async (params = {}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getProductById = async (id: string) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (data: any) => {
  const response = await api.post('/products', data);
  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};
