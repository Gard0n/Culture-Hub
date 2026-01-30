# Culture Hub

Central repo for the Culture Hub project (frontend app in `app/`).

Quick start
- See `app/README.md` for development instructions and env vars.

How to create the GitHub repository
1. Edit `scripts/setup_repo.sh` if you want a different default.
2. Run:
```bash
cd project-ideas/culture-hub
./scripts/setup_repo.sh <your-github-username>/culture-hub
# then follow the instructions printed by the script
```

License: MIT (see `LICENSE`).
# Culture Hub — MVP

But
-----
Créer un espace centralisé pour suivre et partager films, séries et livres (trio de base). Public : amis, petites communautés, cinéphiles/lecteurs.

Vision long-term
-----
Une plateforme open-source et partageable permettant de rassembler tout ce que vous aimez (pas de silos), suivre sorties, noter et découvrir via amis/communautés.

APIs choisies
-----
- Films/Séries : TMDB (The Movie Database)
- Livres : Open Library

Fonctionnalités MVP (priorité donnée)
-----
1. Fil actualité — "Ce qui sort cette semaine" (priorité 1)
2. Ajouter films/séries à sa wishlist / collection personnelle (2)
3. Donner une note / courte review (3)
4. Recherche & filtrage (genre, année, auteur) (4)
5. Voir les collections des amis / profiles publics (5)
6. Notifs (email / in-app) sur sorties intéressantes (6)
7. Groupes thématiques / recommandations communes (7)
8. Export des données personnelles (JSON/CSV) (8)

Comportement social
-----
- Système d'amis (follow) + profils publics avec URL partageable.
- Voir listes publiques et reviews ; possibilité de commenter/débattre.
- Recommandations basées sur amis / listes suivies (v2).

Modèle de données (basique)
-----
- `User` (id, username, displayName, bio, publicProfile, createdAt)
- `Media` (id, type[film/serie/book], externalId, title, year, metadata)
- `List` (id, userId, name, visibility, items[])
- `Review` (id, userId, mediaId, rating, text, createdAt)
- `Follow` (followerId, followeeId)
- `Group` (id, name, members[])

Stack technique recommandé
-----
- Frontend : React (Vite) ou Vue — app statique + client-side
- Backend : Supabase (auth + DB + storage) — correspond au choix B
- Hébergement frontend : GitHub Pages (static) ou Vercel
- Notifications : Supabase + integration email (SendGrid) ou in-app

MVP timeline (6 mois, phases)
-----
- Mois 0-1 : Setup repo, intégration TMDB/Open Library, design minimal, recherche/ajout média
- Mois 1-2 : Wishlist, collections personnelles, notes/reviews, export simple
- Mois 2-3 : Auth (Supabase), profils publics, follow
- Mois 3-4 : Fil "sorties", notifications simples
- Mois 4-6 : Groupes, recommandations sociales, polish, tests

Monétisation / modèle
-----
- Open-source (core) + instance hébergée payante (backup, storage, features avancées)
- Donations / Patreon / sponsors possible

Next steps immédiats
-----
1. Créer repo GitHub `culture-hub` et issues MVP.
2. Prototyper UI liste & fiche média (React + TMDB).
3. Déployer frontend statique sur GitHub Pages + config Supabase.# Culture-Hub
