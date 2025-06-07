import React from 'react';
import {
  Container,
  Navbar,
  Nav,
  Card,
  Button,
  Row,
  Col,
} from 'react-bootstrap';

function App() {
  return (
    <div className="App">
      {/* Navigation */}
      <Navbar expand="lg" className="navbar-zoo">
        <Container>
          <Navbar.Brand href="#" className="text-white fw-bold">
            🦁 Zoo Arcadia
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#" className="text-white">
                Accueil
              </Nav.Link>
              <Nav.Link href="#" className="text-white">
                Habitats
              </Nav.Link>
              <Nav.Link href="#" className="text-white">
                Services
              </Nav.Link>
              <Nav.Link href="#" className="text-white">
                Contact
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Contenu principal */}
      <Container className="mt-5">
        <Row>
          <Col md={8} className="mx-auto text-center">
            <h1 style={{ color: 'var(--zoo-primary)' }}>
              Bienvenue au Zoo Arcadia
            </h1>
            <p className="lead">
              Découvrez la faune exceptionnelle de notre zoo écologique situé
              près de la forêt de Brocéliande en Bretagne.
            </p>
            <Button className="btn-zoo btn-lg me-3">
              Découvrir nos habitats
            </Button>
            <Button variant="outline-success" size="lg">
              Nos services
            </Button>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col md={4}>
            <Card className="card-zoo">
              <Card.Body>
                <Card.Title style={{ color: 'var(--zoo-primary)' }}>
                  🌿 Savane
                </Card.Title>
                <Card.Text>
                  Découvrez les animaux de la savane africaine dans un
                  environnement naturel.
                </Card.Text>
                <Button className="btn-zoo">Explorer</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="card-zoo">
              <Card.Body>
                <Card.Title style={{ color: 'var(--zoo-primary)' }}>
                  🌳 Jungle
                </Card.Title>
                <Card.Text>
                  Plongez dans l'univers tropical de notre habitat jungle.
                </Card.Text>
                <Button className="btn-zoo">Explorer</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="card-zoo">
              <Card.Body>
                <Card.Title style={{ color: 'var(--zoo-primary)' }}>
                  🐸 Marais
                </Card.Title>
                <Card.Text>
                  Observez la faune aquatique dans notre écosystème marécageux.
                </Card.Text>
                <Button className="btn-zoo">Explorer</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;

// import { useState } from 'react';
// import './App.css';

// function App() {
//   const [message, setMessage] = useState([]);

//   const fetchData = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/api/habitats');
//       const data = await response.json();
//       setMessage(data);
//     } catch (error) {
//       console.error('Erreur:', error);
//     }
//   };

//   return (
//     <div className="App">
//       <header className="zoo-header">
//         <h1>🦁 Zoo d'Arcadia - Le Temple de la Nature 🦁</h1>
//         <button className="fetch-btn" onClick={fetchData}>
//           🌿 Découvrir nos Habitats 🌿
//         </button>
//       </header>

//       <div className="habitats-grid">
//         {message.map((habitat, index) => (
//           <div key={index} className="habitat-card">
//             <div className="habitat-icon">
//               {habitat.nom === 'Savane'
//                 ? '🦁'
//                 : habitat.nom === 'Jungle'
//                 ? '🐒'
//                 : '🐊'}
//             </div>
//             <h3 className="habitat-name">{habitat.nom}</h3>
//             <p className="habitat-desc">{habitat.description}</p>
//             <button className="explore-btn">Explorer {habitat.nom} →</button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default App;
