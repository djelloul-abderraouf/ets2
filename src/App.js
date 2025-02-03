import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { UserPlus, Users, FileText, Package, File, Clipboard } from 'react-feather';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Import du JavaScript de Bootstrap


import AddClient from './components/AddClient';
import ClientList from './components/ClientList';
import EditClient from './components/EditClient';
import CreateOrder from './components/CreateOrder';
import OrderList from './components/OrderList';
import PrintOrder from './components/PrintOrder';
import DevisList from './components/DevisList';
import FactureList from './components/FactureList';
import logo from './pages/logo.webp';
import PrintDevis from './components/PrintDevis';
import PrintFacture from './components/PrintFacture';

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm" style={{ borderBottom: '4px solid #39bbd6' }}>

        <div className="container">
          <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
            <img src={logo} alt="Logo" style={{ width: '100px', marginRight: '10px' }} />

          </Link>
          <button
  className="navbar-toggler"
  type="button"
  data-bs-toggle="collapse"
  data-bs-target="#navbarNav"
  aria-controls="navbarNav"
  aria-expanded="false"
  aria-label="Toggle navigation"
>
  <span className="navbar-toggler-icon"></span>
</button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto d-flex align-items-center">
              <li className="nav-item">
                <Link className="nav-link d-flex align-items-center" to="/">
                  <UserPlus size={18} className="me-2" /> Ajouter un Client
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link d-flex align-items-center" to="/clients">
                  <Users size={18} className="me-2" /> Liste des Clients
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link d-flex align-items-center" to="/create-order">
                  <FileText size={18} className="me-2" /> Créer un Bon
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link d-flex align-items-center" to="/orders">
                  <Package size={18} className="me-2" />Les Bons
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link devis-link d-flex align-items-center" to="/devis">
                  <File size={18} className="me-2" /> Les Devis
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link facture-link d-flex align-items-center" to="/facture">
                  <Clipboard size={18} className="me-2" /> Les Factures
                </Link>
              </li>

            </ul>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        <Routes>
          <Route path="/" element={<AddClient />} />
          <Route path="/clients" element={<ClientList />} />
          <Route path="/edit/:id" element={<EditClient />} />
          <Route path="/create-order" element={<CreateOrder />} />
          <Route path="/orders" element={<OrderList />} />
          <Route path="/print-order/:orderId" element={<PrintOrder />} />
          <Route path="/devis" element={<DevisList />} />
          <Route path="/print-devis/:devisId" element={<PrintDevis />} />
          <Route path="/facture" element={<FactureList />} />
          <Route path="/print-facture/:factureId" element={<PrintFacture />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
