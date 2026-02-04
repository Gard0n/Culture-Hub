Culture Hub — app (dev)

Prérequis
-----
- Node.js 18+ recommandé
- Obtenir une clé TMDB : https://www.themoviedb.org/settings/api

Variables d'environnement
-----
Créez un fichier `.env` à la racine du dossier `app/` avec :

VITE_TMDB_API_KEY=YOUR_TMDB_KEY
VITE_TMDB_LANGUAGE=fr-FR   # optionnel — 'fr-FR' pour préférence de langue

Lancer en local
-----
```bash
cd project-ideas/culture-hub/app
npm install
npm run dev
```

Description rapide
-----
- `src/components/Search.jsx` : recherche films/séries via TMDB et livres via OpenLibrary. Ajout vers wishlist.
- `src/components/Wishlist.jsx` : wishlist stockée dans `localStorage` (clé `ch_wishlist`).
- `src/api/tmdb.js` et `src/api/openLibrary.js` : wrappers simples.
 - `src/components/Upcoming.jsx` : fil "Ce qui sort bientôt" (TMDB upcoming) avec ajout rapide.
 - `src/components/MediaDetail.jsx` : modal fiche média, mini-review locale.
 - `src/components/Notifications.jsx` : notifications in-app stockées localement.
 - `src/lib/supabase.js` : stub pour intégration Supabase future.

Prochaines étapes recommandées
-----
1. Ajouter page fiche média (détails, reviews)
2. Intégrer Supabase pour auth + stockage des listes partagées
3. Ajouter profils publics et systeme d'amis
4. Déployer frontend sur GitHub Pages / Vercel

Notes sur features actuelles
-----
- Recherche : supporte films/series (TMDB) et livres (OpenLibrary). Vous pouvez filtrer par année et par genre (pour films/séries).
- Pagination : bouton "Charger plus" pour récupérer plus de résultats.
- Notifications : ajouter un film depuis le fil des sorties crée une notification locale (stockée dans `ch_notifications`).

Notes
-----
- Pour le MVP, le stockage local permet démarrer sans backend. Pour partage et communauté, configurer Supabase (voir `project-ideas/culture-hub/README.md`).
