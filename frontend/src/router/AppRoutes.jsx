import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import des pages publiques
import Accueil from '../pages/Accueil';
import Habitats from '../pages/Habitats';
import HabitatDetail from '../pages/HabitatDetail';
import AnimalDetail from '../pages/AnimalDetail';
import Services from '../pages/Services';
import Contact from '../pages/Contact';

// Import authentification
import Login from '../pages/Login';
import DashboardAdmin from '../pages/DashboardAdmin';

// Import dashboards (à créer)
// import DashboardAdmin from '../pages/dashboards/DashboardAdmin';
// import DashboardEmploye from '../pages/dashboards/DashboardEmploye';
// import DashboardVeterinaire from '../pages/dashboards/DashboardVeterinaire';

/**
 * CENTRALISATION DES ROUTES
 *
 * ORGANISATION :
 * - Routes publiques (visiteurs)
 * - Routes authentification
 * - Routes protégées (dashboards)
 * - Route 404
 *
 * AVANTAGES :
 * - Maintenabilité : toutes routes au même endroit
 * - Lisibilité : structure claire
 * - Évolutivité : facile d'ajouter routes
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/*  ROUTES PUBLIQUES - Accessibles à tous */}
      <Route path="/" element={<Accueil />} />
      <Route path="/habitats" element={<Habitats />} />
      <Route path="/habitat/:id" element={<HabitatDetail />} />
      <Route path="/animal/:id" element={<AnimalDetail />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />

      {/*  ROUTES AUTHENTIFICATION */}
      <Route path="/connexion" element={<Login />} />

      {/*  ROUTES DASHBOARDS - Protégées par rôle */}

      <Route path="/dashboard/admin" element={<DashboardAdmin />} />
      {/* <Route path="/dashboard/employe" element={<DashboardEmploye />} />
      <Route path="/dashboard/veterinaire" element={<DashboardVeterinaire />} />
      */}

      {/*  ROUTE 404 - Page non trouvée */}
      <Route
        path="*"
        element={
          <div className="container mt-5 text-center">
            <h1 style={{ color: 'var(--zoo-primary)' }}>
              404 - Page non trouvée
            </h1>
            <p>La page que vous cherchez n'existe pas.</p>
            <a href="/" className="btn btn-zoo">
              Retour à l'accueil
            </a>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
