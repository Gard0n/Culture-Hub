# Culture Hub - Roadmap & Plan d'action

**Date de création** : 1er février 2026
**Version actuelle** : 0.1.0 (MVP Frontend-only)

---

## 📊 État des lieux

### ✅ Ce qui fonctionne (Frontend complet)

**Composants implémentés** :
- ✅ Recherche films/séries/livres (TMDB + OpenLibrary)
- ✅ Fil "Sorties à venir"
- ✅ Wishlist avec stockage local
- ✅ Collections/catégories
- ✅ Notes & mini-reviews
- ✅ Fiches média détaillées
- ✅ Notifications in-app
- ✅ Partage de wishlist via URL
- ✅ Vue publique des wishlists partagées
- ✅ Export/Import JSON/CSV
- ✅ Statistiques
- ✅ Recommandations basées sur wishlist
- ✅ Dark mode
- ✅ Filtres avancés

**Stack actuelle** :
```
Frontend : React 18 + Vite
Stockage : localStorage
APIs : TMDB + OpenLibrary
Style : CSS custom properties (variables)
```

### ❌ Ce qui manque

**Critique** :
- ❌ Backend / Base de données persistante
- ❌ Authentification utilisateurs
- ❌ Profils utilisateurs (composant stub seulement)
- ❌ Système social (amis/follows)
- ❌ Déploiement production

**Nice to have** :
- ❌ Notifications email
- ❌ Groupes thématiques
- ❌ Commentaires/likes
- ❌ Tests automatisés

---

## 🚫 Contrainte : Pas de Supabase

**Raison** : Limite gratuite atteinte (2 projets max)

### 🔄 Alternatives Backend (gratuites)

**Option A : Firebase (Google)** ⭐ **RECOMMANDÉ**
- ✅ Plan gratuit généreux (Spark Plan)
- ✅ Auth intégrée (email, Google, GitHub, etc.)
- ✅ Firestore (NoSQL) ou Realtime Database
- ✅ Hosting gratuit
- ✅ Cloud Functions (125K appels/mois gratuit)
- ✅ SDK React officiel bien documenté
- ⚠️ NoSQL (différent de Supabase PostgreSQL)

**Option B : Backend Node.js custom + MongoDB Atlas**
- ✅ MongoDB Atlas gratuit (512 MB)
- ✅ Contrôle total
- ✅ JWT auth maison
- ⚠️ Plus de code à écrire
- ⚠️ Hébergement backend à gérer (Render/Railway/Fly.io)

**Option C : PocketBase (self-hosted)**
- ✅ Backend SQLite tout-en-un (comme Supabase)
- ✅ Auth + DB + admin UI inclus
- ✅ Très léger
- ⚠️ Nécessite hébergement (VPS gratuit Railway/Fly.io)
- ⚠️ Moins mature que Firebase

**Option D : Appwrite (cloud)**
- ✅ Alternative open-source à Firebase
- ✅ Plan gratuit cloud disponible
- ✅ Auth + DB + Storage
- ⚠️ Plus récent, communauté plus petite

### 🎯 Choix recommandé : **Firebase**

**Pourquoi ?**
1. Setup ultra rapide (< 1h)
2. SDK React excellent
3. Auth clé en main (pas besoin de coder JWT)
4. Hosting gratuit intégré
5. Scalable si le projet grossit
6. Communauté énorme + docs parfaites

**Migration facile** : Si tu libères un slot Supabase plus tard, la migration sera simple (les concepts sont similaires).

---

## 📋 Plan d'action - Phase 1 (Court terme)

### 🔥 Priorité 1 : Intégration Firebase (2-3 semaines)

**Semaine 1 : Setup & Auth**
- [ ] Créer projet Firebase console
- [ ] Installer Firebase SDK (`npm install firebase`)
- [ ] Configurer Firebase config (`.env`)
- [ ] Créer `src/lib/firebase.js` (init Firebase)
- [ ] Implémenter authentification :
  - [ ] Sign up / Sign in (email/password)
  - [ ] Google OAuth
  - [ ] Logout
  - [ ] Auth persistence
- [ ] Créer composant `Login.jsx`
- [ ] Créer composant `Register.jsx`
- [ ] Protéger routes (auth guard)

**Semaine 2 : Migration données localStorage → Firestore**
- [ ] Créer collections Firestore :
  - `users` : profils utilisateurs
  - `wishlists` : listes personnelles
  - `reviews` : notes/critiques
  - `collections` : collections personnalisées
- [ ] Migrer logique wishlist vers Firestore
- [ ] Migrer logique notes/reviews vers Firestore
- [ ] Migrer notifications vers Firestore
- [ ] Fonction de migration pour users existants (localStorage → Firebase)

**Semaine 3 : Profils utilisateurs**
- [ ] Remplacer stub `Profile.jsx` par vrai composant
- [ ] Page profil avec :
  - [ ] Photo de profil (Firebase Storage)
  - [ ] Bio
  - [ ] Statistiques personnelles
  - [ ] Listes publiques
- [ ] URL profil partageable (`/u/username`)
- [ ] Settings utilisateur

### 🎨 Priorité 2 : Système social (3-4 semaines)

**Follow/Amis**
- [ ] Collection Firestore `follows`
- [ ] Bouton "Suivre" sur profils
- [ ] Liste des followers/following
- [ ] Fil d'actualité des amis
- [ ] Voir wishlists des amis

**Interactions**
- [ ] Likes sur reviews
- [ ] Commentaires sur reviews
- [ ] Notifications sociales (in-app)

### 🚀 Priorité 3 : Déploiement (1 semaine)

- [ ] Déployer sur Firebase Hosting
- [ ] Configurer domaine custom (optionnel)
- [ ] Setup variables d'environnement prod
- [ ] Tests complets pre-production
- [ ] Monitoring erreurs (Firebase Analytics)

---

## 📅 Plan d'action - Phase 2 (Moyen terme)

### 👥 Fonctionnalités communautaires

**Groupes thématiques**
- [ ] Créer/rejoindre groupes
- [ ] Wishlists de groupe
- [ ] Discussions de groupe
- [ ] Recommandations de groupe

**Features sociales avancées**
- [ ] Timeline d'activité
- [ ] Suggestions d'amis (basé sur goûts communs)
- [ ] Listes collaboratives
- [ ] Challenges (ex: "50 films en 2026")

### 📧 Notifications & Engagement

- [ ] Emails sur sorties suivies (Firebase Cloud Functions + SendGrid)
- [ ] Digest hebdomadaire
- [ ] Notifications push (Firebase Cloud Messaging)

### 🎯 UX & Polish

- [ ] Onboarding nouvel utilisateur
- [ ] Tour guidé
- [ ] Skeleton loaders
- [ ] Optimistic UI updates
- [ ] Animations/transitions
- [ ] Responsive mobile parfait
- [ ] PWA (offline mode basique)

### 🧪 Qualité & Tests

- [ ] Tests unitaires (Vitest)
- [ ] Tests composants (React Testing Library)
- [ ] Tests E2E (Playwright)
- [ ] Coverage > 70%
- [ ] Audit accessibilité (a11y)
- [ ] Lighthouse score > 90

---

## 📅 Plan d'action - Phase 3 (Long terme)

### 🌍 Expansion fonctionnelle

**Nouveaux médias**
- [ ] Jeux vidéo (IGDB API)
- [ ] Podcasts (iTunes API)
- [ ] BD/Comics (Comic Vine API)
- [ ] Expositions/musées (éventuellement)

**Features avancées**
- [ ] Système de listes publiques découvrables (ex: "Top 50 films SF")
- [ ] Curateurs certifiés
- [ ] Badges & achievements
- [ ] Intégration calendrier (événements ciné)
- [ ] Plugin navigateur (ajout rapide depuis IMDb/Goodreads)

### 🌐 Internationalisation

- [ ] i18n (react-i18next)
- [ ] Langues : FR, EN, ES
- [ ] Détection langue navigateur

### 📱 Mobile

- [ ] App React Native (iOS + Android)
- [ ] Notifications push natives
- [ ] Partage OS natif

### 💰 Monétisation (si pertinent)

**Modèle freemium** :
- Version gratuite : features actuelles
- Version Pro (5€/mois) :
  - Stats avancées
  - Export illimité
  - Backup cloud automatique
  - Badge Pro
  - Early access nouvelles features

**Alternatives** :
- Donations (Ko-fi / Patreon)
- Sponsors (GitHub Sponsors)
- 100% gratuit + open-source

---

## 🎯 Objectifs mesurables

### Phase 1 (3 mois)
- [ ] 100 utilisateurs beta
- [ ] Déploiement production stable
- [ ] Auth + Profils + Social fonctionnels
- [ ] 0 bugs critiques

### Phase 2 (6 mois)
- [ ] 500 utilisateurs actifs
- [ ] 5000+ médias dans la DB
- [ ] 10+ groupes actifs
- [ ] Tests coverage > 70%

### Phase 3 (12 mois)
- [ ] 2000 utilisateurs
- [ ] Mobile app en beta
- [ ] API publique documentée
- [ ] Communauté active (Discord/Forum)

---

## 🛠️ Stack technique finale

```
Frontend
  ├─ React 18
  ├─ Vite
  ├─ React Router (pages)
  └─ CSS Modules ou Tailwind (optionnel)

Backend
  ├─ Firebase Auth
  ├─ Firestore (DB NoSQL)
  ├─ Firebase Storage (images)
  ├─ Cloud Functions (serverless)
  └─ Firebase Hosting

APIs externes
  ├─ TMDB (films/séries)
  ├─ OpenLibrary (livres)
  └─ (futures : IGDB, iTunes, etc.)

Dev tools
  ├─ ESLint + Prettier
  ├─ Vitest (tests)
  ├─ Playwright (E2E)
  └─ GitHub Actions (CI/CD)
```

---

## 📝 Prochaines étapes immédiates

### 🚀 Cette semaine

1. **Créer projet Firebase** (30 min)
   - Aller sur console.firebase.google.com
   - Créer nouveau projet "culture-hub"
   - Activer Authentication (Email + Google)
   - Activer Firestore Database
   - Copier config Firebase

2. **Installer Firebase SDK** (10 min)
   ```bash
   cd project-ideas/culture-hub/app
   npm install firebase
   ```

3. **Setup Firebase config** (20 min)
   - Créer `src/lib/firebase.js`
   - Ajouter variables `.env` (VITE_FIREBASE_*)
   - Tester connexion

4. **Créer composants Auth** (2-3h)
   - `Login.jsx`
   - `Register.jsx`
   - `AuthContext.jsx` (React Context pour auth state)

5. **Tester auth localement** (30 min)
   - Sign up test user
   - Login/Logout
   - Persistence

### 🎯 Semaine prochaine

- Migration wishlist → Firestore
- Création profils utilisateurs
- Première version déployée sur Firebase Hosting

---

## 🤝 Contribution & Open Source

**Licence** : MIT (déjà définie dans LICENSE)

**Repo public** : À créer sur GitHub
- Issues templates ✅ (déjà créés)
- Contributing guide ✅ (déjà créé)
- README à jour
- Changelog
- Code of Conduct

---

## 📚 Ressources utiles

**Firebase**
- [Firebase Docs](https://firebase.google.com/docs)
- [Firebase React Guide](https://firebase.google.com/docs/web/setup)
- [Firestore Data Modeling](https://firebase.google.com/docs/firestore/data-model)

**APIs**
- [TMDB API Docs](https://developers.themoviedb.org/3)
- [OpenLibrary API](https://openlibrary.org/developers/api)

**Inspiration**
- Letterboxd (films)
- Goodreads (livres)
- Serializd (séries)
- Backloggd (jeux vidéo)

---

## ✅ Checklist rapide avant de coder

- [x] Roadmap définie
- [ ] Firebase projet créé
- [ ] Branches Git créées (`feat/firebase-auth`, `feat/profiles`, etc.)
- [ ] Issues GitHub créées pour tracking
- [ ] Design system/maquettes (optionnel mais recommandé)

---

**Prêt à démarrer ! 🚀**

La prochaine étape concrète est de créer le projet Firebase et d'implémenter l'authentification.
