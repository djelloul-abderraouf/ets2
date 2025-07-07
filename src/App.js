import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {
  SignIn,
  SignUp,
  UserButton,
  SignedIn,
  SignedOut,
  RedirectToSignIn
} from '@clerk/clerk-react';

import { UserPlus, Users, FileText, Package, File, Clipboard } from 'react-feather';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import AddClient from './components/AddClient';
import ClientList from './components/ClientList';
import EditClient from './components/EditClient';
import CreateOrder from './components/CreateOrder';
import OrderList from './components/OrderList';
import PrintOrder from './components/PrintOrder';
import DevisList from './components/DevisList';
import FactureList from './components/FactureList';
import PrintDevis from './components/PrintDevis';
import PrintFacture from './components/PrintFacture';
import logo from './pages/logo.webp';

function App() {
  return (
    <Router>
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm" style={{ borderBottom: '4px solid #39bbd6' }}>
        <div className="container">
          <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
            <img src={logo} alt="Logo" style={{ width: '100px', marginRight: '10px' }} />
          </Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto d-flex align-items-center">
              <SignedIn>
                <li className="nav-item">
                  <UserButton afterSignOutUrl="/sign-in" />
                </li>
              </SignedIn>
              <SignedOut>
                <li className="nav-item">
                  <Link className="nav-link" to="/sign-in">Connexion</Link>
                </li>
              </SignedOut>
            </ul>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <div className="container py-4">
        <Routes>
          {/* Page d'accueil : redirige vers /sign-in si non connecté */}
          <Route path="/" element={
            <>
              <SignedOut><RedirectToSignIn /></SignedOut>
              <SignedIn><AddClient /></SignedIn>
            </>
          } />

          {/* Pages d'authentification */}
          <Route path="/sign-in" element={<SignIn routing="path" path="/sign-in" />} />
          <Route path="/sign-up" element={<SignUp routing="path" path="/sign-up" />} />

          {/* Routes protégées : accessibles uniquement si connecté */}
          <Route path="/clients" element={<SignedIn><ClientList /></SignedIn>} />
          <Route path="/edit/:id" element={<SignedIn><EditClient /></SignedIn>} />
          <Route path="/create-order" element={<SignedIn><CreateOrder /></SignedIn>} />
          <Route path="/orders" element={<SignedIn><OrderList /></SignedIn>} />
          <Route path="/devis" element={<SignedIn><DevisList /></SignedIn>} />
          <Route path="/facture" element={<SignedIn><FactureList /></SignedIn>} />

          {/* Routes d'impression non protégées */}
          <Route path="/print-order/:orderId" element={<PrintOrder />} />
          <Route path="/print-devis/:devisId" element={<PrintDevis />} />
          <Route path="/print-facture/:factureId" element={<PrintFacture />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
