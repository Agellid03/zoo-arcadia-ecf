import React from 'react';

// Import des composants layout
import Header from './components/Header';
import Footer from './components/Footer';

// Import du router centralisé
import AppRoutes from './router/AppRoutes';

/**
 * COMPOSANT PRINCIPAL APPLICATION
 *
 * ARCHITECTURE SIMPLIFIÉE :
 * - Layout fixe (Header + Main + Footer)
 * - Routes centralisées dans AppRoutes
 * - BrowserRouter dans index.js
 *
 * RESPONSABILITÉS :
 * - Structure générale de l'app
 * - Layout responsive Bootstrap
 * - Import et organisation composants
 */
function App() {
  return (
    <div className="App d-flex flex-column min-vh-100">
      <Header />

      <main className="flex-grow-1">
        <AppRoutes />
      </main>

      <Footer />
    </div>
  );
}

export default App;
