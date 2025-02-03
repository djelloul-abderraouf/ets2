import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClientById, updateClient } from '../services/clientService';

const EditClient = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        telephone: '',
        rc: '',
        nif: ''
    });

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const response = await getClientById(id);
                if (response.data) {
                    setFormData(response.data);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération du client:', error);
            }
        };

        fetchClient();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateClient(id, formData);
            alert('Client mis à jour avec succès !');
            navigate('/clients');
        } catch (error) {
            console.error('Erreur lors de la mise à jour du client:', error);
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-sm p-4">
                <h2 className="mb-4 text-center custom-title">Modifier un Client</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Nom</label>
                        <input type="text" name="nom" className="form-control" value={formData.nom} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Prénom</label>
                        <input type="text" name="prenom" className="form-control" value={formData.prenom} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Numéro de téléphone</label>
                        <input type="text" name="telephone" className="form-control" value={formData.telephone} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Numéro de registre de commerce (RC)</label>
                        <input type="text" name="rc" className="form-control" value={formData.rc} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">NIF</label>
                        <input type="text" name="nif" className="form-control" value={formData.nif} onChange={handleChange} />
                    </div>
                    <button type="submit" className="btn custom-btn w-100">Mettre à jour</button>
                </form>
            </div>
        </div>
    );
};

export default EditClient;
