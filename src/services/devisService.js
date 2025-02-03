import axios from 'axios';

const API_URL = 'http://localhost:5000/api/devis'; // ✅ Assurez-vous que l'URL correspond à votre backend

// ✅ Créer un devis
export const createDevis = async (devisData) => {
    try {
        const response = await axios.post(API_URL, devisData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la création du devis:', error);
        throw error;
    }
};

// ✅ Récupérer tous les devis
export const getDevis = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des devis:', error);
        throw error;
    }
};

// ✅ Récupérer un devis par ID
export const getDevisById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération du devis:', error);
        throw error;
    }
};

// ✅ Mettre à jour un devis
export const updateDevis = async (id, updatedData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour du devis:', error);
        throw error;
    }
};

// ✅ Supprimer un devis
export const deleteDevis = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la suppression du devis:', error);
        throw error;
    }
};
