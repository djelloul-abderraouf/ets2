import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDevis } from '../services/devisService';
import { Loader } from 'lucide-react';
import logo from '../pages/logo.webp';

const PrintDevis = () => {
    const { devisId } = useParams();
    const [devis, setDevis] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDevis = async () => {
            setLoading(true);
            try {
                const response = await getDevis();
                const foundDevis = response.find(d => d._id === devisId);
                setDevis(foundDevis);
            } catch (error) {
                console.error('Erreur lors de la récupération du devis:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDevis();
    }, [devisId]);

    const handlePrint = () => {
        const printContent = document.getElementById('devis-content').innerHTML;
        const originalContent = document.body.innerHTML;

        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = originalContent;
        window.location.reload();
    };

    if (loading) {
        return (
            <div className="text-center" style={{ padding: '20px' }}>
                <Loader className="animate-spin" size={48} />
                <p>Chargement du devis en cours...</p>
            </div>
        );
    }

    if (!devis) {
        return <p>Aucun devis trouvé.</p>;
    }

    return (
        <div className="print-container" style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9' }}>
            <div id="devis-content" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                <img src={logo} alt="Logo" style={{ width: '120px', marginBottom: '10px' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div>
                        <h2 style={{ color: '#333' }}>ETS LAKHDARI</h2>
                        <p>lot N°2 Hmaidi Boufarik W.Blida ALGERIE</p>
                        <p>Téléphone: 028 37 67 09 / 028 37 78 11</p>
                        <p>Email: etslectronic@gmail.com</p>
                        <p>RC: 09/00 4054926A09</p>
                        <p>NIF: 28409010316619409000 </p>
                    </div>

                    <div>
                        <h3 style={{ color: '#39bdd6' }}>INFORMATIONS DU CLIENT</h3>
                        <p><strong>Nom :</strong> {devis.clientId?.nom} {devis.clientId?.prenom}</p>
                        <p><strong>Téléphone :</strong> {devis.clientId?.telephone || 'N/A'}</p>
                        <p><strong>NIF :</strong> {devis.clientId?.nif || 'N/A'}</p>
                        <p><strong>RC :</strong> {devis.clientId?.rc || 'N/A'}</p>
                    </div>
                </div>  <hr style={{ border: '1px solid #39bdd6' }} />

                <h2 style={{ textAlign: 'center', color: '#39bdd6', margin: '20px 0' }}>Devis #{devis.devisNumber}</h2>
                <p style={{ textAlign: 'center' }}><strong>Date :</strong> {new Date(devis.dateCreation).toLocaleDateString()}</p>

                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px', marginTop: '20px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#39bdd6', color: '#fff', textAlign: 'center' }}>
                            <th style={{ padding: '15px', border: 'none', borderTopRadius: '8px', borderBottomRadius: '8px', textAlign: 'center' }}>Produit</th>
                            <th style={{ padding: '15px', border: 'none', textAlign: 'center' }}>Quantité</th>
                            <th style={{ padding: '15px', border: 'none', textAlign: 'center' }}>Prix Unitaire (DA)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {devis.produits.map((produit, index) => (
                            <tr key={index} style={{ backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '8px', textAlign: 'center' }}>
                                <td style={{ padding: '15px', border: 'none', textAlign: 'center' }}>{produit.nom}</td>
                                <td style={{ padding: '15px', border: 'none', textAlign: 'center' }}>{produit.quantite}</td>
                                <td style={{ padding: '15px', border: 'none', textAlign: 'center' }}>{produit.prixUnitaire.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h3 style={{ textAlign: 'right', marginTop: '20px', color: '#39bdd6', fontWeight: 'bold' }}>
                    Montant Total : {devis.montantTotal.toFixed(2)} DA
                </h3>
            </div>

            <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <button onClick={handlePrint} style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>Imprimer</button>
            </div>

            <hr style={{ border: '1px solid #39bdd6' }} />

            <style>{`
                @media print {
                    button { display: none; }
                    .print-container {
                        width: 100%;
                        height: 100vh;
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                }
            `}</style>
        </div>
    );
};

export default PrintDevis;
