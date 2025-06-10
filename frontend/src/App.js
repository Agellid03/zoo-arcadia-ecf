import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Accueil from './pages/Accueil';
import Habitats from './pages/Habitats';
import Services from './pages/Services';
import Contact from './pages/Contact';
const App = () => {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/habitats" element={<Habitats />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
