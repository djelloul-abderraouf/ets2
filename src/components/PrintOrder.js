import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrders } from '../services/orderService';
import './PrintOrder.css';
import logo from '../pages/logo.webp';

const PrintOrder = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await getOrders();
                const foundOrder = response.data.find((o) => o._id === orderId);
                setOrder(foundOrder);
            } catch (error) {
                console.error('Erreur lors de la récupération du bon de commande:', error);
            }
        };
        fetchOrder();
    }, [orderId]);

    const handlePrint = () => {
        const printContent = document.querySelector('.print-card').innerHTML;
        const originalContent = document.body.innerHTML;

        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = originalContent;
        window.location.reload();
    };

    if (!order) {
        return <p>Chargement du bon de commande...</p>;
    }

    return (
        <div className="print-container">
            <div className="print-card full-width">
                <div className="header text-center">
                    <img src={logo} alt="Logo de l'entreprise" style={{ width: '120px', marginBottom: '10px' }} />
                </div>
                <hr />

                <h4 className="text-center">Bon de Commande #{order.orderNumber}</h4>
                <p className="text-center"><strong>Date :</strong> {new Date(order.date).toLocaleDateString()}</p>
                <p className="text-center"><strong>Client :</strong> {order.clientId?.nom} {order.clientId?.prenom}</p>

                <div className="order-details">
                    {order.produits.map((produit, index) => (
                        <div key={index} className="product-item">
                            <p><strong>Produit :</strong> {produit.nom}</p>
                            <p><strong>Quantité :</strong> {produit.quantite}</p>
                            {produit.remarque && <p><strong>Remarque :</strong> {produit.remarque}</p>}
                            <hr />
                        </div>
                    ))}
                </div>

                <button className="btn btn-success print-btn" onClick={handlePrint}>Imprimer</button>
            </div>

           
        </div>
    );
};

export default PrintOrder;
