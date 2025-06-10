## Architecture Header
- **Séparation composants** : Header réutilisable sur toutes les pages
- **Bootstrap + Router** : as={Link} to="/" combine Bootstrap Nav + React Router
- **Classes Bootstrap** : ms-auto, fw-bold, Container responsive

## Structure Navigation
- **Header.js** : Composant navigation réutilisable sur toutes pages
- **Séparation responsabilités** : Header séparé de App.js

## Structure App.js
- **Router englobe tout** : BrowserRouter = contexte navigation
- **Header hors Routes** : navigation persistante sur toutes pages
- **Routes = zone variable** : seul le contenu change selon URL