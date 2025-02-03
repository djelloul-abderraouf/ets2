import axios from 'axios';

const API_URL = 'https://ets-backend-1.onrender.com/api/clients';

export const addClient = (clientData) => axios.post(`${API_URL}/add`, clientData);
export const getClients = (search = '', page = 1, limit = 20) => {
    return axios.get(`https://ets-backend-1.onrender.com/api/clients`, {
        params: { search, page, limit },
    });
};
export const getClientById = (id) => {
    return axios.get(`https://ets-backend-1.onrender.com/api/clients/${id}`);
};


export const updateClient = (id, clientData) => axios.put(`${API_URL}/${id}`, clientData);
export const deleteClient = (id) => axios.delete(`${API_URL}/${id}`);
