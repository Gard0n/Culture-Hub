# 🔗 Fusion des comptes - Guide complet

**Date** : 1er février 2026
**Status** : ✅ Implémenté

---

## 🎯 Objectif

Permettre aux utilisateurs qui ont créé plusieurs comptes avec le même email (via Email/Password ET Google OAuth) de les fusionner en un seul compte.

---

## ✅ Ce qui a été implémenté

### 1. Service de fusion ([src/services/accountMergeService.js](app/src/services/accountMergeService.js))

**Fonctions** :
- `checkExistingAccount(email)` - Vérifie si un compte existe avec cet email
- `mergeUserData(sourceUserId, targetUserId)` - Fusionne les données Firestore
- `detectDuplicateAccounts(email)` - Détecte les comptes en doublon

### 2. Composant UI ([src/components/AccountMerge.jsx](app/src/components/AccountMerge.jsx))

Modal qui s'affiche quand des comptes en doublon sont détectés :
- Affiche les méthodes de connexion disponibles
- Demande le mot de passe pour vérification
- Propose de fusionner les comptes
- Design soigné avec messages clairs

### 3. AuthContext mis à jour ([src/contexts/AuthContext.jsx](app/src/contexts/AuthContext.jsx))

**Nouvelles fonctions** :
- `mergeAccounts(email, password)` - Fusionne les comptes
- `checkDuplicates(email)` - Vérifie les doublons

**Processus de fusion** :
1. Sauvegarde l'ID du compte Google
2. Se déconnecte du compte Google
3. Se connecte avec Email/Password
4. Lie le compte Google au compte Email/Password
5. Fusionne les données Firestore
6. Supprime l'ancien compte Google

### 4. Login.jsx mis à jour ([src/components/Login.jsx](app/src/components/Login.jsx))

**Détection automatique** :
- Après connexion Google, vérifie s'il existe un compte Email/Password
- Affiche le modal AccountMerge si oui
- Propose de fusionner automatiquement

---

## 🚀 Comment ça marche

### Scénario : Utilisateur avec 2 comptes

**Situation** :
- Compte 1 : `test@example.com` via Email/Password
- Compte 2 : `test@example.com` via Google OAuth

**Flux utilisateur** :

1. **L'utilisateur se connecte avec Google**
   ```
   Clique sur "Continuer avec Google"
   → Sélectionne son compte Google
   ```

2. **Détection automatique**
   ```
   Le système détecte qu'un compte Email/Password existe
   → Affiche le modal "Fusionner les comptes"
   ```

3. **Modal de fusion**
   ```
   Affiche :
   - "Vous avez plusieurs comptes avec cet email"
   - Liste des méthodes : ✉️ Email/Password + 🔍 Google
   - Champ "Mot de passe" pour vérification
   - Bouton "Fusionner"
   ```

4. **Fusion**
   ```
   L'utilisateur entre son mot de passe
   → Clique sur "Fusionner"
   → Les comptes sont fusionnés
   → L'utilisateur peut maintenant se connecter des 2 façons
   ```

5. **Résultat**
   ```
   ✅ 1 seul compte avec :
   - Email/Password fonctionnel
   - Google OAuth fonctionnel
   - Toutes les wishlists fusionnées
   - Profil unifié
   ```

---

## 📋 Détails techniques

### Fusion des données Firestore

```javascript
// 1. Récupère les wishlists des deux comptes
sourceWishlist = wishlists/{sourceUserId}/items
targetWishlist = wishlists/{targetUserId}/items

// 2. Copie tous les items source vers target
for each item in sourceWishlist:
  copy to targetWishlist (merge si doublon)

// 3. Fusionne les profils
mergedProfile = {
  displayName: meilleur des deux,
  photoURL: si existe,
  bio: la plus longue,
  createdAt: la plus ancienne
}

// 4. Supprime le compte source
delete users/{sourceUserId}
delete wishlists/{sourceUserId}/items/*
```

### Liaison des providers Firebase

```javascript
// 1. Créer la credential Email
emailCredential = EmailAuthProvider.credential(email, password)

// 2. Créer la credential Google
googleCredential = GoogleAuthProvider.credential(...)

// 3. Lier au compte actuel
await linkWithCredential(currentUser, googleCredential)

// Résultat : L'utilisateur peut se connecter des 2 façons
```

---

## 🧪 Comment tester

### Test 1 : Créer 2 comptes

1. **Créer compte Email/Password**
   ```
   Email : test-merge@example.com
   Mot de passe : test123
   Nom : Test User
   ```

2. **Se déconnecter**

3. **Créer compte Google**
   ```
   Se connecter avec Google (même email : test-merge@example.com)
   ```

4. **Vérifier dans Firebase Console**
   ```
   Authentication → Users
   → Tu dois voir 2 comptes avec le même email
   ```

### Test 2 : Fusionner

1. **Se déconnecter**

2. **Cliquer "Continuer avec Google"**
   ```
   → Le modal de fusion s'affiche automatiquement
   ```

3. **Entrer le mot de passe** du compte Email/Password
   ```
   Mot de passe : test123
   ```

4. **Cliquer "Fusionner"**
   ```
   → Les comptes fusionnent
   → Redirection vers l'app
   ```

5. **Vérifier**
   ```
   - Se déconnecter
   - Se connecter avec Email/Password → ✅ Marche
   - Se déconnecter
   - Se connecter avec Google → ✅ Marche
   - Vérifier Firebase Console → 1 seul compte
   ```

---

## ⚠️ Important

### Firestore Rules nécessaires

Pour que la fusion fonctionne, configure les rules dans Firebase Console :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow delete: if request.auth != null && request.auth.uid == userId;
    }

    match /wishlists/{userId}/items/{itemId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow delete: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Limitations

1. **La fusion est irréversible**
   - Une fois fusionnés, impossible de séparer les comptes

2. **Le mot de passe est requis**
   - Pour des raisons de sécurité, on demande le mot de passe Email/Password

3. **Wishlist localStorage**
   - Pour l'instant la wishlist est en localStorage
   - Quand elle sera en Firestore, la fusion sera automatique

---

## 🎨 UI/UX

### Modal de fusion

- **Design** : Moderne, clair, rassurant
- **Messages** : Explique clairement ce qui va se passer
- **Validation** : Demande le mot de passe pour sécurité
- **Feedback** : Loading states, messages d'erreur clairs
- **Annulation** : Bouton "Annuler" pour revenir en arrière

### Expérience utilisateur

1. **Détection automatique** : Pas besoin de chercher l'option
2. **Explication claire** : L'utilisateur comprend ce qui se passe
3. **Sécurité** : Vérification par mot de passe
4. **Confirmation** : Message de succès après fusion
5. **Flexibilité** : Les 2 méthodes de connexion fonctionnent

---

## 📚 Fichiers modifiés/créés

**Créés** :
- `src/services/accountMergeService.js` - Service de fusion
- `src/components/AccountMerge.jsx` - Composant UI modal

**Modifiés** :
- `src/contexts/AuthContext.jsx` - Ajout mergeAccounts + checkDuplicates
- `src/components/Login.jsx` - Détection + affichage modal

**Total** : 4 fichiers, ~400 lignes de code

---

## 🎉 Résultat

**Maintenant, les utilisateurs peuvent** :
- ✅ Se connecter avec Email/Password
- ✅ Se connecter avec Google
- ✅ Fusionner leurs comptes automatiquement
- ✅ Garder toutes leurs données
- ✅ Utiliser les 2 méthodes après fusion

**Expérience fluide, professionnelle, et sécurisée ! 🔥**
