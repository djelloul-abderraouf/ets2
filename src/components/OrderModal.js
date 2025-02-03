import React, { useState, useEffect } from 'react';
import { updateOrder, deleteOrder } from '../services/orderService';

const OrderModal = ({ order, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        produits: [],
        montantTotal: 0,
        isPaid: false,
        isDelivered: false,
    });

    useEffect(() => {
        if (order) {
            setFormData({
                produits: order.produits,
                montantTotal: order.montantTotal,
                isPaid: order.isPaid,
                isDelivered: order.isDelivered,
            });
        }
    }, [order]);

    useEffect(() => {
        const total = formData.produits.reduce((acc, produit) => acc + (produit.quantite * produit.prixUnitaire), 0);
        setFormData((prev) => ({ ...prev, montantTotal: total }));
    }, [formData.produits]);

    const handleChange = (e, index) => {
        const { name, value, type, checked } = e.target;

        if (name === 'isPaid' || name === 'isDelivered') {
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            const updatedProduits = [...formData.produits];
            updatedProduits[index][name] = type === 'number' ? parseFloat(value) : value;
            setFormData((prev) => ({ ...prev, produits: updatedProduits }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateOrder(order._id, formData);
            onUpdate(); // Rafraîchir la liste des commandes après modification
            onClose();
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la commande:', error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Voulez-vous vraiment supprimer ce bon de commande ?')) {
            try {
                await deleteOrder(order._id);
                onUpdate(); // Rafraîchir la liste des commandes après suppression
                onClose();
            } catch (error) {
                console.error('Erreur lors de la suppression de la commande:', error);
            }
        }
    };

    return (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Détails de la Commande</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <h6>Produits :</h6>
                            {formData.produits.map((produit, index) => (
                                <div key={index} className="border p-2 mb-2 rounded">
                                    <div className="mb-2">
                                        <label>Nom du produit</label>
                                        <input
                                            type="text"
                                            name="nom"
                                            className="form-control"
                                            value={produit.nom}
                                            onChange={(e) => handleChange(e, index)}
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label>Quantité</label>
                                        <input
                                            type="number"
                                            name="quantite"
                                            className="form-control"
                                            value={produit.quantite}
                                            onChange={(e) => handleChange(e, index)}
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label>Prix Unitaire (DA)</label>
                                        <input
                                            type="number"
                                            name="prixUnitaire"
                                            className="form-control"
                                            value={produit.prixUnitaire}
                                            onChange={(e) => handleChange(e, index)}
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label>Remarque</label>
                                        <textarea
                                            name="remarque"
                                            className="form-control"
                                            value={produit.remarque}
                                            onChange={(e) => handleChange(e, index)}
                                        />
                                    </div>
                                </div>
                            ))}

                            <div className="mb-3">
                                <strong>Montant Total : {formData.montantTotal.toFixed(2)} DA</strong>
                            </div>

                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    name="isPaid"
                                    checked={formData.isPaid}
                                    onChange={handleChange}
                                />
                                <label className="form-check-label">Payé</label>
                            </div>
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    name="isDelivered"
                                    checked={formData.isDelivered}
                                    onChange={handleChange}
                                />
                                <label className="form-check-label">Livré</label>
                            </div>

                            <div className="mt-3 d-flex justify-content-between">
                                <button type="submit" className="btn btn-primary">Enregistrer les modifications</button>
                                <button type="button" className="btn btn-danger" onClick={handleDelete}>Supprimer la commande</button>
                                <button type="button" className="btn btn-secondary" onClick={onClose}>Fermer</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderModal;
