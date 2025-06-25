# 🦁 Zoo Arcadia - Application Web de Gestion

## 📋 Table des Matières

- [🎯 Présentation](#-présentation)
- [✨ Fonctionnalités](#-fonctionnalités)
- [🏗️ Architecture](#️-architecture)
- [🚀 Installation](#-installation)
- [📱 Utilisation](#-utilisation)
- [🔐 Authentification](#-authentification)
- [📊 Base de Données](#-base-de-données)
- [🌐 Déploiement](#-déploiement)
- [🧪 Tests](#-tests)
- [📚 Documentation](#-documentation)
- [👥 Contributeurs](#-contributeurs)

## 🎯 Présentation

**Zoo Arcadia** est une application web moderne dédiée à la gestion d'un zoo écologique situé en Bretagne. L'application permet aux visiteurs de découvrir les habitats et animaux du zoo, tout en fournissant des outils de gestion complets pour l'équipe (administrateurs, employés, vétérinaires).

### 🌟 Points Forts

- **🌱 Écologique** : Suivi des statistiques de consultation respectueux de la vie privée
- **🔒 Sécurisé** : Authentification JWT avec gestion des rôles
- **📱 Responsive** : Interface adaptée à tous les appareils
- **⚡ Performant** : Architecture optimisée avec base de données hybride
- **🎨 Moderne** : Design attractif inspiré des valeurs écologiques

## ✨ Fonctionnalités

### 👥 Espace Visiteurs (Public)
- 🏠 **Page d'accueil** avec présentation dynamique du zoo
- 🦁 **Navigation habitats** : découverte des écosystèmes et animaux
- 📊 **Compteur de consultation** automatique et invisible
- 💬 **Système d'avis** avec modération
- 📞 **Contact** avec formulaire de demande
- 🎯 **Services** disponibles au zoo

### 🔐 Espaces Authentifiés

#### 👑 Dashboard Administrateur
- 📈 **Statistiques** de consultation des animaux (MongoDB)
- 👥 **Gestion utilisateurs** (CRUD complet)
- 📋 **Vue d'ensemble** des rapports vétérinaires
- 🏗️ **Gestion contenus** (habitats, animaux, services)

#### 👷 Dashboard Employé  
- ✅ **Validation avis** visiteurs
- 🍽️ **Enregistrement alimentation** quotidienne des animaux
- 🎯 **Modification services** du zoo

#### 🩺 Dashboard Vétérinaire
- 📋 **Rapports de santé** par animal
- 🏡 **Commentaires habitats** pour amélioration
- 📊 **Suivi alimentation** donnée par les employés

## 🏗️ Architecture

### Frontend
```
React.js 18.x
├── React Router      # Navigation
├── Bootstrap 5       # UI Framework
├── Axios            # API Client
└── localStorage     # Authentification
```

### Backend
```
Node.js + Express.js
├── Sequelize ORM    # Base relationnelle
├── SQLite           # Stockage principal
├── MongoDB          # Statistiques
├── JWT              # Authentification
└── bcrypt           # Sécurité mots de passe
```

### Base de Données Hybride
- **SQLite** : Données relationnelles (utilisateurs, habitats, animaux)
- **MongoDB** : Statistiques de consultation des animaux

## 🚀 Installation

### Prérequis
- Node.js 18.x ou supérieur
- npm ou yarn
- Git

### 1. Cloner le Repository
```bash
git clone https://github.com/votre-username/zoo-arcadia-ecf.git
cd zoo-arcadia-ecf
```

### 2. Installation Backend
```bash
# Naviguer vers le backend
cd backend

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos configurations
```

### 3. Configuration Base de Données
```bash
# Créer la base SQLite et les tables
npm run db:migrate

# Peupler avec des données de test (optionnel)
npm run db:seed
```

### 4. Installation Frontend
```bash
# Naviguer vers le frontend
cd ../frontend

# Installer les dépendances
npm install

# Configurer l'URL de l'API
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env.local
```

### 5. Démarrage en Mode Développement
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm start
```

L'application sera accessible sur :
- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:5000

## 📱 Utilisation

### Accès Public
Visitez http://localhost:3000 pour accéder à l'interface visiteur.

### Comptes de Test
```bash
# Administrateur
Email: admin@zoo.fr
Mot de passe: [voir avec l'équipe]

# Employé
Email: employe@zoo.fr  
Mot de passe: [voir avec l'équipe]

# Vétérinaire
Email: veterinaire@zoo.fr
Mot de passe: [voir avec l'équipe]
```

### Navigation
1. **Page d'accueil** → Présentation générale
2. **Habitats** → Liste des écosystèmes  
3. **Habitat détail** → Animaux de l'habitat
4. **Animal détail** → Fiche complète + rapport vétérinaire
5. **Connexion** → Accès aux dashboards selon le rôle

## 🔐 Authentification

L'application utilise **JWT (JSON Web Tokens)** pour l'authentification :

- **Génération** : Lors de la connexion réussie
- **Stockage** : localStorage côté client
- **Validation** : Middleware backend sur les routes protégées
- **Expiration** : 24 heures
- **Rôles** : admin, employe, veterinaire

### Protection des Routes
```javascript
// Exemple de middleware d'authentification
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token manquant' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token invalide' });
    req.user = user;
    next();
  });
};
```

## 📊 Base de Données

### Modèle Relationnel (SQLite)
```sql
-- Utilisateurs du système
Users: id, email, password, role, createdAt

-- Habitats du zoo  
Habitats: id, nom, description, superficie, temperature, image

-- Animaux par habitat
Animals: id, prenom, race, habitat_id, image_url

-- Services proposés
Services: id, nom, description

-- Avis visiteurs
Avis: id, pseudo, texte, statut, employe_id, createdAt

-- Rapports vétérinaires
RapportVeterinaire: id, animal_id, veterinaire_id, etat_animal, 
                   nourriture_proposee, grammage_nourriture, date_passage

-- Consommation alimentaire
ConsommationNourriture: id, animal_id, employe_id, date_consommation,
                       heure_consommation, nourriture_donnee, quantite
```

### Modèle NoSQL (MongoDB)
```javascript
// Collection des statistiques
AnimalStats: {
  animal_id: Number,
  animal_name: String,
  views: Number,
  last_viewed: Date
}
```

## 🌐 Déploiement

### Production (Render.com)

#### Backend
```bash
# URL de production
https://zoo-arcadia-ecf.onrender.com

# Variables d'environnement requises
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=production
```

#### Frontend
```bash
# URL de production  
https://zoo-arcadia-frontend.onrender.com

# Variables d'environnement
REACT_APP_API_URL=https://zoo-arcadia-ecf.onrender.com/api
```

### Build de Production
```bash
# Backend
npm run build

# Frontend
npm run build
# Les fichiers optimisés sont générés dans /build
```

### Déploiement Automatique
- **Trigger** : Push sur la branche `main`
- **Backend** : Redéploiement automatique en ~5-10 minutes
- **Frontend** : Rebuild et mise à jour automatiques

## 🧪 Tests

### Tests Backend
```bash
cd backend
npm test                 # Tests unitaires
npm run test:integration # Tests d'intégration
npm run test:coverage   # Couverture de code
```

### Tests Frontend
```bash
cd frontend
npm test                # Tests Jest + React Testing Library
npm run test:e2e        # Tests end-to-end (Cypress)
```

### Tests API (Manuel)
```bash
# Tester les endpoints avec curl ou Postman
curl -X GET http://localhost:5000/api/habitats
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@zoo.fr","password":"password"}'
```

## 📚 Documentation

### Structure du Projet
```
zoo-arcadia-ecf/
├── backend/
│   ├── config/          # Configuration BDD
│   ├── models/          # Modèles Sequelize + MongoDB  
│   ├── routes/          # Routes API
│   ├── middleware/      # Authentification
│   └── server.js        # Point d'entrée
├── frontend/
│   ├── public/          # Assets statiques
│   ├── src/
│   │   ├── components/  # Composants réutilisables
│   │   ├── pages/       # Pages principales
│   │   ├── router/      # Configuration routes
│   │   └── App.js       # Composant racine
└── docs/                # Documentation technique
```

### API Endpoints
```bash
# Publics
GET  /api/habitats           # Liste habitats
GET  /api/habitats/:id       # Détail habitat  
GET  /api/animaux/:id        # Détail animal
POST /api/animaux/:id/view   # Incrémenter compteur
GET  /api/services           # Liste services
POST /api/avis               # Créer avis
POST /api/contact            # Contact

# Authentifiés
POST /api/login              # Connexion
GET  /api/users              # Liste utilisateurs (admin)
GET  /api/avis/all           # Tous avis (employé+)
PUT  /api/avis/:id           # Valider avis (employé)
POST /api/rapports           # Créer rapport (vétérinaire)
GET  /api/dashboard/stats    # Statistiques (admin)
```

### Standards de Code
- **ESLint** : Configuration React + Node.js
- **Prettier** : Formatage automatique
- **Git** : Commits conventionnels
- **Comments** : JSDoc pour les fonctions importantes

## 👥 Contributeurs

### Équipe de Développement
- **Développeur Principal** : Verso
- **Encadrement** : Studi - Formation Développeur Web

### Contexte Académique
Projet développé dans le cadre de l'**ECF (Évaluation en Cours de Formation)** pour le titre professionnel **Développeur Web et Web Mobile**.

### Compétences Démontrées
- **Frontend** : Développement d'interfaces dynamiques et responsives
- **Backend** : Création d'API REST sécurisées
- **Base de Données** : Conception hybride SQL/NoSQL
- **Déploiement** : Mise en production avec CI/CD
- **Gestion de Projet** : Méthode agile, Git Flow

---

## 📄 Licence

Ce projet est développé dans un cadre académique pour l'ECF Développeur Web et Web Mobile.

## 🚀 Liens Utiles

- **🌐 Application Live** : [https://zoo-arcadia-frontend.onrender.com](https://zoo-arcadia-frontend.onrender.com)
- **📡 API Backend** : [https://zoo-arcadia-ecf.onrender.com](https://zoo-arcadia-ecf.onrender.com)
- **📚 Documentation API** : [Lien vers la doc technique]
- **🎨 Maquettes** : [Lien vers les wireframes]

---

