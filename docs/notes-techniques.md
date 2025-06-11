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
- **element={}** : v6, remplace component= de 

## Navigation Dynamique React Router
- **useParams()** : récupère paramètres depuis URL (/habitat/:id)
- **useNavigate()** : navigation programmatique (redirections)
- **Dependency array [id]** : useEffect se re-exécute si ID change
- **Breadcrumb** : navigation hiérarchique pour UX
- **Link avec paramètres** : to={`/animal/${animal.id}`}

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

## React useState Hook
- **const [state, setState] = useState(defaultValue)** 
- **Controlled components** : value={state} onChange={handler}
- **Spread operator** : {...formData, [name]: value}

## React Hooks Avancés
- **useEffect(fn, [])** : side effects, remplace componentDidMount
- **Dependency array** : [] = 1 fois, [state] = quand state change
- **cleanup** : return function pour nettoyer (éviter memory leaks)

## useEffect - Compréhension
- **Rôle** : exécuter code APRÈS affichage composant
- **[] vide** : exécution 1 seule fois (comme componentDidMount)
- **[variable]** : re-exécute SI variable change
- **Sans tableau** : re-exécute à chaque render (éviter !)
- **Usage typique** : appels API, timers, subscriptions

## Gestion États Asynchrones
- **Loading state** : feedback utilisateur pendant chargement
- **Error state** : gestion robuste erreurs réseau/serveur
- **Success state** : affichage données quand tout OK

## Axios HTTP Client
- **axios.get(url)** : requête GET, retourne Promise
- **async/await** : syntaxe moderne pour asynchrone
- **try/catch/finally** : gestion complète erreurs

## Pattern API Duplication
- **Structure identique** : useState(loading/error/data) + useEffect + fetchFunction
- **Seuls changements** : endpoint API + structure données affichage
- **Réutilisabilité** : 80% code identique entre pages
- **Maintenance** : bug fixé 1 fois = fixé partout

## Multi-API Calls
- **useEffect multiples** : chargement parallèle de différentes données
- **Loading states séparés** : UX progressive, chaque section charge indépendamment
- **slice(0, 3)** : limiter résultats pour preview
- **substring(0, 100)** : tronquer texte long



## Authentification JWT (US9)

### Concepts clés :
- **JWT Token** : passeport numérique signé par le serveur
- **localStorage** : stockage côté client (simple pour ECF)
- **Headers Authorization** : `Bearer ${token}` pour API protégées
- **Redirection automatique** : selon rôle utilisateur

### Flux authentification :
1. Utilisateur saisit email/password
2. Frontend → POST /api/login
3. Backend vérifie → génère token JWT
4. Frontend stocke token + user data
5. Redirection vers dashboard selon rôle

### Sécurité :
- Token contient : userID, role, expiration
- Signature serveur avec JWT_SECRET
- Vérification token sur routes protégées

## Dashboards Complets (US6, US7, US8)

### Architecture commune :
- **Protection par rôle** : vérification token + role
- **Déconnexion** : nettoyage localStorage
- **États UI** : loading, error, success
- **Modals** : formulaires complexes

### Dashboard Admin (US6) :
- **Stats MongoDB** : affichage US11 pour analyse
- **Gestion utilisateurs** : CRUD complet
- **Vue d'ensemble** : rapports vétérinaires

### Dashboard Employé (US7) :
- **Validation avis** : approuver/rejeter visiteurs
- **Alimentation** : enregistrement consommation
- **Services** : modification autorisée

### Dashboard Vétérinaire (US8) :
- **Rapports animaux** : état santé détaillé
- **Commentaires habitats** : amélioration environnement
- **Suivi alimentation** : contrôle employés

### Formulaire Avis (US5) :
- **Soumission visiteurs** : pseudo + texte
- **Statut en_attente** : modération obligatoire
- **Validation** : longueur, caractères