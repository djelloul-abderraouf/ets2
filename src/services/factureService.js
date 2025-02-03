import axios from 'axios';

const API_URL = 'http://localhost:5000/api/facture'; // ✅ Assurez-vous que l'URL correspond à votre backend

// ✅ Créer une Facture
export const createFacture = async (factureData) => {
    try {
        const response = await axios.post(API_URL, factureData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la création de Facture:', error);
        throw error;
    }
};

// ✅ Récupérer tous les Facture
export const getFacture = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des Facture:', error);
        throw error;
    }
};

// ✅ Récupérer un Facture par ID
export const getFactureById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération du Facture:', error);
        throw error;
    }
};

// ✅ Mettre à jour une Facture
export const updateFacture = async (id, updatedData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour du Facture:', error);
        throw error;
    }
};

// ✅ Supprimer un Facture
export const deleteFacture = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la suppression du Facture:', error);
        throw error;
    }
};
