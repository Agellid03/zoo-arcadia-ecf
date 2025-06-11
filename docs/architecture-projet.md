## Architecture Header
- **Séparation composants** : Header réutilisable sur toutes les pages
- **Bootstrap + Router** : as={Link} to="/" combine Bootstrap Nav + React Router
- **Classes Bootstrap** : ms-auto, fw-bold, Container responsive

## Structure Navigation
- **Header.js** : Composant navigation réutilisable sur toutes pages
- **Séparation responsabilités** : Header séparé de App.js

## Routes Dynamiques
- **Pattern URL** : /habitat/:id → récupération ID via useParams
- **Navigation imbriquée** : Habitats → Habitat détail → Animal détail
- **API avec paramètres** : GET /api/habitats/:id
- **Gestion erreurs** : 404, validation ID, loading states
## Architecture Router

### Structure :
- **index.js** : BrowserRouter global
- **App.js** : Layout + logique principale
- **router/AppRoutes.jsx** : Centralisation routes

### Avantages :
- **Séparation responsabilités** : chaque fichier a un rôle clair
- **Maintenabilité** : routes centralisées
- **Réutilisabilité** : hooks navigation partout
- **Lisibilité** : structure évidente

### Pattern :
- Layout fixe (Header/Footer)
- Contenu dynamique (Routes)
- Navigation globale accessible

## Structure App.js
- **Router englobe tout** : BrowserRouter = contexte navigation
- **Header hors Routes** : navigation persistante sur toutes pages
- **Routes = zone variable** : seul le contenu change selon URL

## Pattern API Integration
- **Fonction fetch séparée** : réutilisable et testable
- **États multiples** : loading/error/data
- **URL centralisée** : API_BASE_URL configurable
- **Error handling** : différents types erreurs gérés

## Efficacité Développement
- **1 pattern maîtrisé** = toutes pages API rapides à créer
- **Code prévisible** = facilite debug et maintenance
- **Standard équipe** = autres développeurs comprennent immédiatement

## Page Accueil Architecture
- **Vitrine dynamique** : vraies données backend
- **Navigation intégrée** : call-to-action vers pages détaillées  
- **Loading progressif** : sections chargent indépendamment
- **UX optimisée** : statistiques, previews, avis