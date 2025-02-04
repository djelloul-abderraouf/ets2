import React, { useEffect, useState } from 'react';
import { getDevis, deleteDevis, updateDevis } from '../services/devisService';
import { useNavigate } from 'react-router-dom';
import './ClientList.css';

const DevisList = () => {
    const [devisList, setDevisList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDevis, setSelectedDevis] = useState(null);
    const [formData, setFormData] = useState({ produits: [], clientId: '', montantTotal: 0 });
    const [currentPage, setCurrentPage] = useState(1);
    const devisPerPage = 25;
    const navigate = useNavigate();

    useEffect(() => {
        fetchDevis();
    }, []);

    const fetchDevis = async () => {
        try {
            const response = await getDevis();
            setDevisList(response.reverse());
        } catch (error) {
            console.error('Erreur lors de la récupération des devis:', error);
        }
    };

    const handlePrintDevis = (devisId) => {
        navigate(`/print-devis/${devisId}`);
    };

    const handleDeleteDevis = async (devisId) => {
        if (window.confirm('Voulez-vous vraiment supprimer ce devis ?')) {
            try {
                await deleteDevis(devisId);
                fetchDevis();
            } catch (error) {
                console.error('Erreur lors de la suppression du devis:', error);
            }
        }
    };

    const handleEditDevis = (devis) => {
        setSelectedDevis(devis);
        setFormData({
            clientId: devis.clientId._id,
            produits: devis.produits.map(prod => ({ ...prod })),
            montantTotal: devis.montantTotal || 0
        });
    };

    const handleInputChange = (index, field, value) => {
        const newProduits = [...formData.produits];
        newProduits[index][field] = value;
        const montantTotal = calculateTotal(newProduits);
        setFormData({ ...formData, produits: newProduits, montantTotal });
    };

    const calculateTotal = (produits) => {
        return produits.reduce((total, produit) => {
            return total + (parseFloat(produit.prixUnitaire || 0) * parseInt(produit.quantite || 0));
        }, 0);
    };

    const handleSaveChanges = async () => {
        try {
            await updateDevis(selectedDevis._id, formData);
            alert('✅ Devis mis à jour avec succès !');
            setSelectedDevis(null);
            fetchDevis();
        } catch (error) {
            console.error('Erreur lors de la mise à jour du devis:', error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const filteredDevis = devisList.filter(devis =>
        devis.clientId?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        devis.clientId?.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        devis.devisNumber.toString().includes(searchTerm)
    );

    const indexOfLastDevis = currentPage * devisPerPage;
    const indexOfFirstDevis = indexOfLastDevis - devisPerPage;
    const currentDevis = filteredDevis.slice(indexOfFirstDevis, indexOfLastDevis);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container mt-4">
            <div className="card shadow-sm p-4">
                <h2 className="mb-4 text-center custom-title">Liste des Devis</h2>

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <input
                        type="text"
                        className="form-control w-50"
                        placeholder="Rechercher par nom du client ou numéro de devis..."
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
                        <span className="page-indicator">Page {currentPage} sur {Math.ceil(filteredDevis.length / devisPerPage)}</span>
                        <button
                            className="btn custom-btn ms-2"
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === Math.ceil(filteredDevis.length / devisPerPage)}
                        >
                            Suivant
                        </button>
                    </div>
                </div>

                {currentDevis.length === 0 ? (
                    <p>Aucun devis trouvé.</p>
                ) : (
                    <table className="table table-bordered table-striped">
                        <thead className="table-dark">
                            <tr>
                                <th>Numéro de Devis</th>
                                <th>Nom du Client</th>
                                <th>Produits</th>
                                <th>Montant Total (DA)</th>
                                <th>Date de Création</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentDevis.map((devis, index) => (
                                <tr key={index}>
                                    <td>{devis.devisNumber}</td>
                                    <td>{devis.clientId?.nom} {devis.clientId?.prenom}</td>
                                    <td>
                                        <ul className="list-unstyled mb-0">
                                            {devis.produits.map((produit, idx) => (
                                                <li key={idx}>{produit.nom} (x{produit.quantite})</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td>{(devis.montantTotal || 0).toFixed(2)} DA</td>
                                    <td>{new Date(devis.dateCreation).toLocaleDateString()}</td>
                                    <td>
                                        <div className="d-flex justify-content-center flex-wrap gap-2">
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handlePrintDevis(devis._id)}
                                            >
                                                Imprimer
                                            </button>
                                            <button
                                                className="btn btn-warning btn-sm"
                                                onClick={() => handleEditDevis(devis)}
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDeleteDevis(devis._id)}
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {selectedDevis && (
                    <div className="modal show d-block" tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Modifier le Devis #{selectedDevis.devisNumber}</h5>
                                    <button type="button" className="btn-close" onClick={() => setSelectedDevis(null)}></button>
                                </div>
                                <div className="modal-body">
                                    {formData.produits.map((produit, index) => (
                                        <div key={index} className="mb-3">
                                            <label>Nom du produit</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={produit.nom}
                                                onChange={(e) => handleInputChange(index, 'nom', e.target.value)}
                                            />
                                            <label>Quantité</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={produit.quantite}
                                                onChange={(e) => handleInputChange(index, 'quantite', e.target.value)}
                                            />
                                            <label>Prix Unitaire</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={produit.prixUnitaire || 0}
                                                onChange={(e) => handleInputChange(index, 'prixUnitaire', e.target.value)}
                                            />
                                            <label>Remarque</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={produit.remarque || ''}
                                                onChange={(e) => handleInputChange(index, 'remarque', e.target.value)}
                                            />
                                        </div>
                                    ))}
                                    <h5 className="text-end">Montant Total : {(formData.montantTotal || 0).toFixed(2)} DA</h5>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setSelectedDevis(null)}>Annuler</button>
                                    <button type="button" className="btn btn-success" onClick={handleSaveChanges}>Enregistrer</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DevisList;
