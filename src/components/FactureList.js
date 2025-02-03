import React, { useEffect, useState } from 'react';
import { getFacture, deleteFacture, updateFacture } from '../services/factureService';
import { useNavigate } from 'react-router-dom';
import './ClientList.css'; // Import du CSS personnalisé

const FactureList = () => {
    const [factureList, setFactureList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFacture, setSelectedFacture] = useState(null);
    const [formData, setFormData] = useState({ produits: [], clientId: '', montantTotal: 0 });
    const [currentPage, setCurrentPage] = useState(1);
    const facturePerPage = 25;
    const navigate = useNavigate();

    useEffect(() => {
        fetchFacture();
    }, []);

    const fetchFacture = async () => {
        try {
            const response = await getFacture();
            setFactureList(response.reverse());
        } catch (error) {
            console.error('Erreur lors de la récupération des Facture:', error);
        }
    };

    const handlePrintFacture = (factureId) => {
        navigate(`/print-facture/${factureId}`);
    };

    const handleDeleteFacture = async (factureId) => {
        if (window.confirm('Voulez-vous vraiment supprimer ce Facture ?')) {
            try {
                await deleteFacture(factureId);
                fetchFacture();
            } catch (error) {
                console.error('Erreur lors de la suppression du Facture:', error);
            }
        }
    };

    const handleEditFacture = (facture) => {
        setSelectedFacture(facture);
        setFormData({
            clientId: facture.clientId._id,
            produits: facture.produits.map(prod => ({ ...prod })),
            montantTotal: facture.montantTotal || 0
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
            await updateFacture(selectedFacture._id, formData);
            alert('✅ Facture mis à jour avec succès !');
            setSelectedFacture(null);
            fetchFacture();
        } catch (error) {
            console.error('Erreur lors de la mise à jour du Facture:', error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const filteredFacture = factureList.filter(facture =>
        facture.clientId?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        facture.clientId?.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        facture.factureNumber.toString().includes(searchTerm)
    );

    const indexOfLastFacture = currentPage * facturePerPage;
    const indexOfFirstFacture = indexOfLastFacture - facturePerPage;
    const currentFacture = filteredFacture.slice(indexOfFirstFacture, indexOfLastFacture);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container mt-4">
            <div className="card shadow-sm p-4">
                <h2 className="mb-4 text-center custom-title">Liste des Factures</h2>

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <input
                        type="text"
                        className="form-control w-50"
                        placeholder="Rechercher par nom du client ou numéro de Facture..."
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
                        <span className="page-indicator">Page {currentPage} sur {Math.ceil(filteredFacture.length / facturePerPage)}</span>
                        <button
                            className="btn custom-btn ms-2"
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === Math.ceil(filteredFacture.length / facturePerPage)}
                        >
                            Suivant
                        </button>
                    </div>
                </div>

                {currentFacture.length === 0 ? (
                    <p>Aucun Facture trouvé.</p>
                ) : (
                    <table className="table table-bordered table-striped">
                        <thead className="table-dark">
                            <tr>
                                <th>Numéro de Facture</th>
                                <th>Nom du Client</th>
                                <th>Produits</th>
                                <th>Montant Total (DA)</th>
                                <th>Date de Création</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentFacture.map((facture, index) => (
                                <tr key={index}>
                                    <td>{facture.factureNumber}</td>
                                    <td>{facture.clientId?.nom} {facture.clientId?.prenom}</td>
                                    <td>
                                        <ul className="list-unstyled mb-0">
                                            {facture.produits.map((produit, idx) => (
                                                <li key={idx}>{produit.nom} (x{produit.quantite})</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td>{(facture.montantTotal || 0).toFixed(2)} DA</td>
                                    <td>{new Date(facture.dateCreation).toLocaleDateString()}</td>
                                    <td>
                                    <button
                                            className="btn btn-primary btn-sm me-2"
                                            onClick={() => handlePrintFacture(facture._id)}
                                        >
                                            Imprimer
                                        </button>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => handleEditFacture(facture)}
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDeleteFacture(facture._id)}
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

               

                {selectedFacture && (
                    <div className="modal show d-block" tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Modifier le Facture #{selectedFacture.factureNumber}</h5>
                                    <button type="button" className="btn-close" onClick={() => setSelectedFacture(null)}></button>
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
                                    <button type="button" className="btn btn-secondary" onClick={() => setSelectedFacture(null)}>Annuler</button>
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

export default FactureList;