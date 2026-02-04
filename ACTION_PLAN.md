# Plan d'action immédiat - Culture Hub

**Date** : 1er février 2026
**Objectif** : Passer de localStorage à Firebase Auth + Firestore en 1-2 semaines

---

## 🎯 Sprint 1 : Firebase Auth (Semaine 1)

### Jour 1-2 : Setup Firebase & Auth Context

**Tâches** :
1. ✅ Créer projet Firebase console
2. ✅ Activer Authentication (Email + Google)
3. ✅ Activer Firestore Database
4. ✅ Activer Storage
5. ✅ Récupérer config Firebase
6. ✅ `npm install firebase` dans `/app`
7. ✅ Créer `src/lib/firebase.js`
8. ✅ Ajouter variables `.env` (VITE_FIREBASE_*)
9. ✅ Créer `src/contexts/AuthContext.jsx`
10. ✅ Wrapper App dans AuthProvider (`main.jsx`)

**Livrables** :
- Firebase initialisé et connecté
- Auth context fonctionnel
- Pas encore de UI

**Temps estimé** : 2-3h

---

### Jour 3-4 : Composants Login/Register

**Tâches** :
1. ✅ Créer `src/components/Login.jsx`
2. ✅ Créer `src/components/Register.jsx`
3. ✅ Modifier `App.jsx` pour afficher Login si non connecté
4. ✅ Ajouter bouton Logout dans header
5. ✅ Tester signup avec email/password
6. ✅ Tester login avec email/password
7. ✅ Tester login avec Google
8. ✅ Tester logout
9. ✅ Vérifier persistence (refresh page)

**Livrables** :
- UI Login/Register complète
- Authentification fonctionnelle (3 méthodes)
- Utilisateur connecté persiste

**Temps estimé** : 3-4h

---

### Jour 5 : Migration wishlist localStorage → Firestore

**Tâches** :
1. ✅ Créer `src/services/wishlistService.js`
   - `getWishlist(userId)`
   - `addToWishlist(userId, item)`
   - `removeFromWishlist(userId, itemId)`
   - `updateWishlistItem(userId, itemId, updates)`
2. ✅ Modifier `App.jsx` :
   - Remplacer localStorage par Firestore calls
   - `useEffect` pour charger wishlist au login
   - Adapter `addToWishlist()`, `removeFromWishlist()`, etc.
3. ✅ Créer fonction de migration (optionnel)
   - Bouton "Importer depuis localStorage"
   - Pour users existants avec data locale
4. ✅ Tester ajout/suppression/modification

**Livrables** :
- Wishlist sauvegardée dans Firestore
- Data persiste entre sessions
- Migration localStorage possible

**Temps estimé** : 3-4h

---

### Jour 6-7 : Firestore Security Rules & Tests

**Tâches** :
1. ✅ Configurer Firestore Rules (voir GETTING_STARTED_FIREBASE.md)
2. ✅ Tester permissions :
   - User A ne peut pas modifier wishlist de User B
   - User A peut voir wishlist publique de User B
3. ✅ Créer collection `users` dans Firestore
4. ✅ Créer profil user au signup (doc dans `users/{uid}`)
5. ✅ Ajouter displayName, photoURL, bio
6. ✅ Tests complets end-to-end :
   - Signup → Add items → Logout → Login → Items toujours là
   - Multiple users ne se mélangent pas

**Livrables** :
- Security rules configurées
- Profils utilisateurs créés automatiquement
- App sécurisée et fonctionnelle

**Temps estimé** : 2-3h

---

## 🎯 Sprint 2 : Profils utilisateurs (Semaine 2)

### Jour 8-9 : Composant Profile

**Tâches** :
1. ✅ Remplacer stub `Profile.jsx` par vrai composant
2. ✅ Afficher :
   - Photo de profil (Firebase Storage)
   - Nom d'affichage
   - Bio
   - Email (privé)
   - Date d'inscription
3. ✅ Formulaire d'édition profil :
   - Upload photo (Firebase Storage)
   - Éditer displayName
   - Éditer bio
4. ✅ Service `userService.js` :
   - `getUserProfile(userId)`
   - `updateUserProfile(userId, updates)`
   - `uploadProfilePhoto(userId, file)`
5. ✅ Bouton "Mon profil" dans header

**Livrables** :
- Page profil fonctionnelle
- Édition profil
- Upload photo de profil

**Temps estimé** : 4-5h

---

### Jour 10-11 : Profils publics & URL partageable

**Tâches** :
1. ✅ Créer route `/u/:username` ou `/profile/:userId`
2. ✅ Ajouter champ `username` unique dans users
3. ✅ Vérifier unicité username au signup/edit
4. ✅ Afficher profil public :
   - Photo, nom, bio
   - Statistiques (X films, Y livres, etc.)
   - Wishlist publique (filtrable)
5. ✅ Ajouter paramètre `isPublic` sur wishlists
6. ✅ Toggle "Rendre ma wishlist publique/privée"
7. ✅ Bouton "Partager mon profil" (copier URL)

**Livrables** :
- Profils publics accessibles via URL
- Wishlists publiques/privées
- Partage facile

**Temps estimé** : 4-5h

---

### Jour 12-13 : Statistiques & polish

**Tâches** :
1. ✅ Améliorer composant `Stats.jsx` :
   - Lecture données depuis Firestore (pas localStorage)
   - Ajouter graphiques (optionnel - Chart.js ou Recharts)
2. ✅ Ajouter stats sur profil public :
   - Total médias
   - Répartition par type (films/séries/livres)
   - Note moyenne
   - Top genres
3. ✅ Optimisations :
   - Loading states partout
   - Error handling
   - Skeleton loaders
4. ✅ Responsive mobile check complet

**Livrables** :
- Stats détaillées
- UX polie
- App responsive

**Temps estimé** : 3-4h

---

### Jour 14 : Déploiement production

**Tâches** :
1. ✅ `npm run build` sans erreurs
2. ✅ Vérifier toutes les variables d'env sont OK
3. ✅ `firebase deploy`
4. ✅ Tester app en production :
   - Signup/Login
   - Ajout wishlist
   - Profils publics
   - Partage
5. ✅ Ajouter domaine custom (optionnel)
6. ✅ Setup Firebase Analytics
7. ✅ Créer page d'accueil publique (landing page)

**Livrables** :
- App live sur Firebase Hosting
- URL partageable fonctionnelle
- Analytics activé

**Temps estimé** : 2-3h

---

## 🚀 Sprint 3 : Social features (Semaines 3-4)

### Semaine 3 : Système de follows

**Fonctionnalités** :
1. Collection Firestore `follows` :
   ```
   follows/{followId}
     - followerId: userId
     - followingId: userId
     - createdAt: timestamp
   ```
2. Composant `FollowButton.jsx` :
   - Bouton "Suivre" / "Ne plus suivre"
   - Afficher sur profils publics
3. Services :
   - `followUser(followerId, followingId)`
   - `unfollowUser(followerId, followingId)`
   - `getFollowers(userId)`
   - `getFollowing(userId)`
4. Page "Mes abonnements" / "Mes abonnés"
5. Fil d'activité des personnes suivies :
   - "Jean a ajouté Inception à sa wishlist"
   - "Marie a noté Dune 5/5"

**Temps estimé** : 8-10h

---

### Semaine 4 : Interactions sociales

**Fonctionnalités** :
1. Likes sur reviews :
   - Collection `reviewLikes`
   - Bouton like sur reviews
   - Compteur
2. Commentaires sur reviews :
   - Collection `comments`
   - Formulaire ajout commentaire
   - Affichage thread
3. Notifications in-app Firestore :
   - "X a aimé ta review"
   - "Y a commenté ta review"
   - "Z te suit maintenant"
4. Badge notification non-lues
5. Page notifications

**Temps estimé** : 10-12h

---

## 📊 Métriques de succès

### Sprint 1 (Semaine 1)
- [x] Firebase configuré
- [ ] Auth fonctionne (email + Google)
- [ ] Wishlist migrée vers Firestore
- [ ] 0 bugs critiques

### Sprint 2 (Semaine 2)
- [ ] Profils utilisateurs complets
- [ ] Profils publics partageables
- [ ] App déployée en production
- [ ] 5-10 beta testers

### Sprint 3 (Semaines 3-4)
- [ ] Système de follows fonctionnel
- [ ] Interactions sociales (likes/comments)
- [ ] Notifications
- [ ] 50+ utilisateurs beta

---

## 🛠️ Outils de développement

### Organisation
- **GitHub Projects** : Kanban board pour tracker les tâches
- **Issues GitHub** : 1 issue par feature
- **Branches Git** :
  - `main` : production
  - `develop` : développement
  - `feat/firebase-auth` : feature auth
  - `feat/profiles` : feature profils
  - `feat/social` : feature social

### Qualité
- **ESLint** : Linting code
- **Prettier** : Formatting
- **Console errors** : Vérifier régulièrement
- **Firebase Console** : Surveiller usage/errors

---

## 📝 Prochaines étapes IMMÉDIATEMENT

### Aujourd'hui (1h)

1. **Créer projet Firebase** (15 min)
   - Aller sur console.firebase.google.com
   - Créer projet "culture-hub"
   - Activer Auth (Email + Google)
   - Activer Firestore
   - Copier config

2. **Setup local** (30 min)
   ```bash
   cd project-ideas/culture-hub/app
   npm install firebase
   ```
   - Créer `src/lib/firebase.js`
   - Ajouter variables `.env`
   - Tester connexion (console.log)

3. **Git branches** (15 min)
   ```bash
   git checkout -b feat/firebase-auth
   git push -u origin feat/firebase-auth
   ```

### Demain (3-4h)

1. **Auth Context** (1h)
   - Créer `src/contexts/AuthContext.jsx`
   - Wrapper App

2. **Login/Register** (2-3h)
   - Créer composants
   - Intégrer dans App.jsx
   - Tester signup/login/logout

---

## ✅ Definition of Done

**Pour chaque feature** :
- [ ] Code fonctionne localement
- [ ] Pas d'erreurs console
- [ ] Responsive mobile
- [ ] Loading states ajoutés
- [ ] Error handling
- [ ] Commit Git avec message clair
- [ ] (Optionnel) Tests écrits

**Pour chaque sprint** :
- [ ] Toutes les tâches complétées
- [ ] Build réussit (`npm run build`)
- [ ] Déployé sur Firebase Hosting
- [ ] Testé en production
- [ ] Merge dans `develop`

---

## 🎉 Let's go!

**Première action** : Créer le projet Firebase console (30 min)

Une fois fait, revenir ici et cocher les tâches au fur et à mesure.

Bon code ! 🚀
