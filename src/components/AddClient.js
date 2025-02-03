import React, { useState } from 'react';
import { addClient } from '../services/clientService';
import './addClient.css'; // Assurez-vous que le CSS est bien importé

const AddClient = () => {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        telephone: '',
        rc: '',
        nif: ''
    });

    const [alert, setAlert] = useState({ message: '', type: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addClient(formData);
            setAlert({ message: 'Client ajouté avec succès !', type: 'success' });
            setFormData({ nom: '', prenom: '', telephone: '', rc: '', nif: '' });
        } catch (error) {
            console.error(error);
            setAlert({ message: 'Erreur lors de l’ajout du client.', type: 'danger' });
        }

        setTimeout(() => {
            setAlert({ message: '', type: '' });
        }, 3000);
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-sm p-4">
                <h2 className="mb-4 text-center custom-title">Ajouter un Client</h2>

                {alert.message && (
                    <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                        {alert.message}
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="alert"
                            aria-label="Close"
                            onClick={() => setAlert({ message: '', type: '' })}
                        ></button>
                    </div>
                )}

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
                    <button type="submit" className="btn custom-btn w-100">Ajouter</button>
                </form>
            </div>
        </div>
    );
};

export default AddClient;
