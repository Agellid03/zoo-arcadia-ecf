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
      <header className="App-header">
        <h1>Zoo d'Arcadia 🦁</h1>
        <button onClick={fetchData}>Récupérer les habitats du backend</button>
        {message.map((habitat, index) => (
          <p key={index}>
            {habitat.nom}: {habitat.description}
          </p>
        ))}
      </header>
    </div>
  );
}

export default App;
