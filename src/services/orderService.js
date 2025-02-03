import axios from 'axios';

const API_URL = 'https://ets-backend-1.onrender.com/api/orders';

export const createOrder = (orderData) => {
    return axios.post(`${API_URL}/create`, orderData);
};

export const getOrders = () => {
    return axios.get(API_URL);
};

// ✅ Ajouter cette fonction
export const updateOrder = (orderId, updatedData) => {
    return axios.put(`${API_URL}/${orderId}`, updatedData);
};

export const deleteOrder = (orderId) => axios.delete(`${API_URL}/${orderId}`); // ✅ Fonction de suppression