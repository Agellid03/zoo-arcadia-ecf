# Notes Techniques - Zoo Arcadia

## Gestion dépendances
- **Chaque dossier** = projet npm séparé avec son package.json
- **Frontend** = React, Router, Bootstrap
- **Backend** = Express, Sequelize, JWT

## React Router
- **Concept** : Gestion navigation SPA sans rechargement
- **SPA** : Single Page Application
- **Installation** : npm install react-router-dom

## Conventions URLs
- **URLs minuscules** : /habitats, /services, /contact (standard web)
- **Cohérence** : path="/contact" doit = to="/contact"
- **Import paths** : './pages/Accueil' doit correspondre au nom fichier

## Composants React Router
- **Link vs <a>** : Link = navigation SPA sans rechargement, <a> = navigation classique avec rechargement
- **BrowserRouter** : Conteneur principal qui active le routing
- **Routes** : Conteneur des définitions de routes
- **Route** : Définition URL → Composant

## React Router v6
- **BrowserRouter** : Conteneur principal, utilise History API
- **Routes** : Remplace Switch v5, analyse URL actuelle  
- **Route** : path="/habitats" element={<Habitats />}
- **element={}** : v6, remplace component= de v5

## Architecture Header
- **Séparation composants** : Header réutilisable sur toutes les pages
- **Bootstrap + Router** : as={Link} to="/" combine Bootstrap Nav + React Router
- **Classes Bootstrap** : ms-auto, fw-bold, Container responsive

## Bootstrap
- **Concept** : Framework CSS responsive
- **Thème** : Couleurs écologiques (vert forêt)
- **Classes custom** : .btn-zoo, .navbar-zoo, .card-zoo

## Syntaxes Composants React
- **Arrow function** : const Component = () => {} (moderne)
- **Function declaration** : function Component() {} (classique)  
- **Choix** : arrow = plus concis, function = meilleur debug
- **Performance** : différence négligeable en React
