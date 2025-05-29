import { useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/habitats');
      const data = await response.json();
      setMessage(data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div className="App">
      <header className="zoo-header">
        <h1>🦁 Zoo d'Arcadia - Le Temple de la Nature 🦁</h1>
        <button className="fetch-btn" onClick={fetchData}>
          🌿 Découvrir nos Habitats 🌿
        </button>
      </header>

      <div className="habitats-grid">
        {message.map((habitat, index) => (
          <div key={index} className="habitat-card">
            <div className="habitat-icon">
              {habitat.nom === 'Savane'
                ? '🦁'
                : habitat.nom === 'Jungle'
                ? '🐒'
                : '🐊'}
            </div>
            <h3 className="habitat-name">{habitat.nom}</h3>
            <p className="habitat-desc">{habitat.description}</p>
            <button className="explore-btn">Explorer {habitat.nom} →</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
