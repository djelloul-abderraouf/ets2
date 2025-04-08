import React, { useState, useEffect } from 'react';
import { getClients } from '../services/clientService';
import { createOrder } from '../services/orderService';

const CreateOrder = () => {
    const [clients, setClients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredClients, setFilteredClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [produits, setProduits] = useState([{ nom: '', quantite: 1, prixUnitaire: 0, remarque: '' }]);
    const [montantTotal, setMontantTotal] = useState(0);
    const [isPaid, setIsPaid] = useState(false);
    const [isDelivered, setIsDelivered] = useState(false);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await getClients('', 1, 1000); // ou une valeur plus grande selon ton besoin
                setClients(Array.isArray(response.data.clients) ? response.data.clients : []);
            } catch (error) {
                console.error('Erreur lors de la récupération des clients:', error);
                setClients([]);
            }
        };
        fetchClients();
    }, []);

    useEffect(() => {
        const total = produits.reduce((acc, produit) => acc + (produit.quantite * produit.prixUnitaire), 0);
        setMontantTotal(total);
    }, [produits]);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value.trim() !== '') {
            const filtered = clients.filter(client =>
                `${client.nom} ${client.prenom}`.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredClients(filtered);
        } else {
            setFilteredClients([]);
        }
    };

    const handleSelectClient = (client) => {
        setSelectedClient(client);
        setSearchTerm(`${client.nom} ${client.prenom}`);
        setFilteredClients([]);
    };

    const handleProductChange = (index, e) => {
        const updatedProduits = [...produits];
        updatedProduits[index][e.target.name] = e.target.value;
        setProduits(updatedProduits);
    };

    const addProduct = () => {
        setProduits([...produits, { nom: '', quantite: 1, prixUnitaire: 0, remarque: '' }]);
    };

    const removeProduct = (index) => {
        const updatedProduits = produits.filter((_, i) => i !== index);
        setProduits(updatedProduits);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!selectedClient) {
                alert('Veuillez sélectionner un client.');
                return;
            }
            await createOrder({
                clientId: selectedClient._id,
                produits,
                montantTotal,
                isPaid,
                isDelivered
            });
            alert('Bon de commande créé avec succès !');
            setSelectedClient(null);
            setSearchTerm('');
            setProduits([{ nom: '', quantite: 1, prixUnitaire: 0, remarque: '' }]);
            setMontantTotal(0);
            setIsPaid(false);
            setIsDelivered(false);
        } catch (error) {
            console.error('Erreur lors de la création du bon de commande:', error);
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-sm p-4">
                <h2 className="mb-4 text-center custom-title">Créer un Bon</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3 position-relative">
                        <label className="form-label">Rechercher un Client</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nom du client..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        {filteredClients.length > 0 && (
                            <ul className="list-group position-absolute w-100 shadow-sm" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                                {filteredClients.map((client) => (
                                    <li
                                        key={client._id}
                                        className="list-group-item list-group-item-action"
                                        onClick={() => handleSelectClient(client)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {client.nom} {client.prenom} - {client.telephone}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {produits.map((produit, index) => (
                        <div key={index} className="border p-3 mb-3 rounded">
                            <div className="mb-2">
                                <label>Nom du produit</label>
                                <input
                                    type="text"
                                    name="nom"
                                    className="form-control"
                                    value={produit.nom}
                                    onChange={(e) => handleProductChange(index, e)}
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label>Quantité</label>
                                <input
                                    type="number"
                                    name="quantite"
                                    className="form-control"
                                    value={produit.quantite}
                                    onChange={(e) => handleProductChange(index, e)}
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label>Prix Unitaire</label>
                                <input
                                    type="number"
                                    name="prixUnitaire"
                                    className="form-control"
                                    value={produit.prixUnitaire}
                                    onChange={(e) => handleProductChange(index, e)}
                                    required
                                />
                            </div>
                            <div className="mb-2">
                                <label>Remarque</label>
                                <textarea
                                    name="remarque"
                                    className="form-control"
                                    value={produit.remarque}
                                    onChange={(e) => handleProductChange(index, e)}
                                />
                            </div>
                            {produits.length > 1 && (
                                <button
                                    type="button"
                                    className="btn btn-danger btn-sm"
                                    onClick={() => removeProduct(index)}
                                >
                                    Supprimer le produit
                                </button>
                            )}
                        </div>
                    ))}

                    <button type="button" className="btn btn-secondary mb-3" onClick={addProduct}>
                        ➕ Ajouter un produit
                    </button>

                    <div className="mb-3">
                        <label className="form-check-label me-3">
                            <input
                                type="checkbox"
                                className="form-check-input me-1"
                                checked={isPaid}
                                onChange={(e) => setIsPaid(e.target.checked)}
                            />
                            Payé
                        </label>

                        <label className="form-check-label">
                            <input
                                type="checkbox"
                                className="form-check-input me-1"
                                checked={isDelivered}
                                onChange={(e) => setIsDelivered(e.target.checked)}
                            />
                            Livré
                        </label>
                    </div>

                    <div className="mb-3">
                        <h4 className="text-end">Montant Total : {montantTotal.toFixed(2)} DA</h4>
                    </div>

                    <button type="submit" className="btn custom-btn w-100">Créer le Bon</button>
                </form>
            </div>
        </div>
    );
};

export default CreateOrder;
