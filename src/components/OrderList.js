import React, { useEffect, useState } from 'react';
import { getOrders } from '../services/orderService';
import { createDevis } from '../services/devisService';
import { createFacture } from '../services/factureService';
import OrderModal from './OrderModal';
import { useNavigate } from 'react-router-dom';
import './ClientList.css'; // Import du CSS personnalisé

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getOrders();
                setOrders(response.data);
                setFilteredOrders(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des bons de commande:', error);
            }
        };
        fetchOrders();
    }, []);

    const handleUpdate = async () => {
        try {
            const response = await getOrders();
            setOrders(response.data);
            setFilteredOrders(response.data);
        } catch (error) {
            console.error('Erreur lors de la mise à jour des commandes:', error);
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);

        const filtered = orders.filter(order =>
            order.clientId?.nom.toLowerCase().includes(value) ||
            order.clientId?.prenom.toLowerCase().includes(value) ||
            order.orderNumber.toString().includes(value) ||
            order.produits.some(produit => produit.nom.toLowerCase().includes(value))
        );

        setFilteredOrders(filtered);
        setCurrentPage(1);
    };

    const handlePrint = (orderId) => {
        navigate(`/print-order/${orderId}`);
    };

    const handleCreateDevis = async (order) => {
        try {
            const devisData = {
                clientId: order.clientId._id,
                produits: order.produits,
                dateCreation: new Date(),
            };
            await createDevis(devisData);
            alert('✅ Devis créé avec succès !');
        } catch (error) {
            console.error('Erreur lors de la création du devis:', error);
            alert('❌ Une erreur est survenue lors de la création du devis.');
        }
    };

    const handleCreateFacture = async (order) => {
        try {
            const factureData = {
                clientId: order.clientId._id,
                produits: order.produits,
                dateCreation: new Date(),
            };
            await createFacture(factureData);
            alert('✅ Facture créé avec succès !');
        } catch (error) {
            console.error('Erreur lors de la création du Facture:', error);
            alert('❌ Une erreur est survenue lors de la création du Facture.');
        }
    };

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container mt-4">
            <div className="card shadow-sm p-4">
                <h2 className="mb-4 text-center custom-title">Liste des Bons</h2>

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <input
                        type="text"
                        className="form-control w-50"
                        placeholder="Rechercher par client, produit ou numéro de commande..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />

                    <div className="pagination-container">
                        <button
                            className="btn custom-btn me-2"
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Précédent
                        </button>
                        <span className="page-indicator">Page {currentPage} sur {Math.ceil(filteredOrders.length / ordersPerPage)}</span>
                        <button
                            className="btn custom-btn ms-2"
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === Math.ceil(filteredOrders.length / ordersPerPage)}
                        >
                            Suivant
                        </button>
                    </div>
                </div>

                {currentOrders.length === 0 ? (
                    <p>Aucun bon de commande trouvé.</p>
                ) : (
                    <table className="table table-bordered text-center">
                        <thead className="table-dark">
                            <tr>
                                <th>Numéro de Commande</th>
                                <th>Nom du Client</th>
                                <th>Produits</th>
                                <th>Prix Total (DA)</th>
                                <th>Date de Création</th>
                                <th>Statut de Paiement</th>
                                <th>Statut de Livraison</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentOrders.map((order) => (
                                <tr 
                                    key={order._id} 
                                    style={{ cursor: 'pointer' }} 
                                    onClick={() => setSelectedOrder(order)}
                                >
                                    <td>{order.orderNumber}</td>
                                    <td>{order.clientId?.nom} {order.clientId?.prenom}</td>
                                    <td>
                                        <ul className="list-unstyled mb-0">
                                            {order.produits.map((produit, index) => (
                                                <li key={index}>{produit.nom} (x{produit.quantite})</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td>{(order.montantTotal || 0).toFixed(2)}</td>
                                    <td>{new Date(order.date).toLocaleDateString()}</td>
                                    <td>{order.isPaid ? '✅ Payé' : '❌ Non payé'}</td>
                                    <td>{order.isDelivered ? '📦 Livré' : '⏳ En attente'}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <div className="d-flex justify-content-center gap-2">
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handlePrint(order._id);
                                                }}
                                            >
                                                Imprimer
                                            </button>
                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCreateDevis(order);
                                                }}
                                            >
                                                Créer Devis
                                            </button>
                                            <button
                                                className="btn btn-sm"
                                                style={{ backgroundColor: '#FF5722', color: '#fff', border: 'none' }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCreateFacture(order);
                                                }}
                                            >
                                                Créer Facture
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {selectedOrder && (
                    <OrderModal
                        order={selectedOrder}
                        onClose={() => setSelectedOrder(null)}
                        onUpdate={handleUpdate}
                    />
                )}
            </div>
        </div>
    );
};

export default OrderList;
