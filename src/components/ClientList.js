import React, { useEffect, useState } from 'react';
import { getClients, deleteClient } from '../services/clientService';
import { useNavigate } from 'react-router-dom';
import './ClientList.css'; // Assurez-vous que le fichier CSS est importé

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async (search = '', page = 1) => {
        try {
            const response = await getClients(search, page);
            setClients(response.data.clients);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.currentPage);
        } catch (error) {
            console.error('Erreur lors du chargement des clients:', error);
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        fetchClients(value);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer ce client ?')) {
            try {
                await deleteClient(id);
                fetchClients(searchTerm); // Rafraîchir la liste après suppression
            } catch (error) {
                console.error('Erreur lors de la suppression du client:', error);
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/edit/${id}`);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            fetchClients(searchTerm, newPage);
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-sm p-4">
                <h2 className="mb-4 text-center custom-title">Liste des Clients</h2>

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <input
                        type="text"
                        className="form-control w-50"
                        placeholder="Rechercher par nom, prénom ou téléphone..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />

                    <div className="pagination-container">
                        <button
                            className="btn custom-btn me-2"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Précédent
                        </button>
                        <span className="page-indicator">Page {currentPage} sur {totalPages}</span>
                        <button
                            className="btn custom-btn ms-2"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Suivant
                        </button>
                    </div>
                </div>

                <table className="table table-bordered text-center">
                    <thead className="table-dark">
                        <tr>
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>Téléphone</th>
                            <th>RC</th>
                            <th>NIF</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => (
                            <tr key={client._id}>
                                <td>{client.nom}</td>
                                <td>{client.prenom}</td>
                                <td>{client.telephone}</td>
                                <td>{client.rc}</td>
                                <td>{client.nif}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => handleEdit(client._id)}
                                    >
                                        Modifier
                                    </button>

                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(client._id)}
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClientList;
