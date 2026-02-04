# Guide de démarrage Firebase - Culture Hub

**Objectif** : Migrer de localStorage vers Firebase pour avoir auth + DB persistante

---

## 🎯 Phase 1 : Setup Firebase (30-45 min)

### 1. Créer le projet Firebase

1. Aller sur [console.firebase.google.com](https://console.firebase.google.com)
2. Cliquer "Ajouter un projet"
3. Nom du projet : `culture-hub` (ou `culture-hub-prod`)
4. Activer Google Analytics : **Oui** (recommandé)
5. Créer le projet

### 2. Activer Authentication

1. Dans le menu Firebase, aller dans **Authentication**
2. Cliquer "Get started"
3. Activer les méthodes :
   - ✅ **Email/Password** (activer)
   - ✅ **Google** (activer et configurer)
   - (Optionnel) GitHub, Facebook, etc.

### 3. Créer Firestore Database

1. Dans le menu Firebase, aller dans **Firestore Database**
2. Cliquer "Create database"
3. Mode : **Production** (avec rules restrictives)
4. Région : `europe-west` (pour EU) ou `us-central` (pour US)
5. Créer

### 4. Configurer Storage (pour photos de profil)

1. Dans le menu Firebase, aller dans **Storage**
2. Cliquer "Get started"
3. Mode : **Production**
4. Même région que Firestore
5. Créer

### 5. Récupérer la config Firebase

1. Dans les paramètres du projet (⚙️ → Project settings)
2. Scroll vers "Your apps"
3. Cliquer sur l'icône Web `</>`
4. Nom de l'app : `culture-hub-web`
5. Activer Firebase Hosting : **Oui**
6. Copier l'objet de configuration :

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "culture-hub-xxxxx.firebaseapp.com",
  projectId: "culture-hub-xxxxx",
  storageBucket: "culture-hub-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
  measurementId: "G-XXXXXXX"
};
```

---

## 🛠️ Phase 2 : Intégration dans le code (1-2h)

### 1. Installer les dépendances

```bash
cd project-ideas/culture-hub/app
npm install firebase
```

### 2. Créer le fichier de config Firebase

**Créer** : `app/src/lib/firebase.js`

```javascript
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app
```

### 3. Créer le fichier `.env` Firebase

**Éditer** : `app/.env`

Ajouter (en plus de TMDB) :

```env
# TMDB (existant)
VITE_TMDB_API_KEY=ton_existante_clé

# Firebase (nouveau)
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=culture-hub-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=culture-hub-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=culture-hub-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXX
```

### 4. Créer le AuthContext

**Créer** : `app/src/contexts/AuthContext.jsx`

```javascript
import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { auth } from '../lib/firebase'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Sign up
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  // Login
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  // Login with Google
  function loginWithGoogle() {
    const provider = new GoogleAuthProvider()
    return signInWithPopup(auth, provider)
  }

  // Logout
  function logout() {
    return signOut(auth)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    signup,
    login,
    loginWithGoogle,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
```

### 5. Wrapper l'app avec AuthProvider

**Éditer** : `app/src/main.jsx`

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from './contexts/AuthContext'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
```

---

## 🔐 Phase 3 : Créer les composants d'authentification (2-3h)

### 1. Composant Login

**Créer** : `app/src/components/Login.jsx`

```javascript
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Login({ onSwitch }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, loginWithGoogle } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setError('')
      setLoading(true)
      await login(email, password)
    } catch (err) {
      setError('Échec de la connexion : ' + err.message)
    }
    setLoading(false)
  }

  async function handleGoogleLogin() {
    try {
      setError('')
      setLoading(true)
      await loginWithGoogle()
    } catch (err) {
      setError('Échec de la connexion Google : ' + err.message)
    }
    setLoading(false)
  }

  return (
    <div style={{
      maxWidth: 400,
      margin: '60px auto',
      padding: 32,
      background: 'var(--bg-secondary)',
      borderRadius: 12,
      boxShadow: 'var(--shadow)'
    }}>
      <h2 style={{ margin: '0 0 24px', fontSize: 24, textAlign: 'center' }}>
        Connexion
      </h2>

      {error && (
        <div style={{
          padding: 12,
          background: '#fee',
          color: '#c00',
          borderRadius: 6,
          marginBottom: 16,
          fontSize: 14
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 14 }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 6,
              border: '1px solid var(--border)',
              fontSize: 14
            }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 14 }}>
            Mot de passe
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 6,
              border: '1px solid var(--border)',
              fontSize: 14
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: 12,
            background: 'var(--accent)',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>

      <div style={{ margin: '16px 0', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>
        ou
      </div>

      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        style={{
          width: '100%',
          padding: 12,
          background: 'white',
          color: '#333',
          border: '1px solid #ddd',
          borderRadius: 6,
          fontSize: 14,
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8
        }}
      >
        <span>🔍</span> Continuer avec Google
      </button>

      <div style={{ marginTop: 24, textAlign: 'center', fontSize: 14 }}>
        Pas encore de compte ?{' '}
        <button
          onClick={onSwitch}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent)',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          S'inscrire
        </button>
      </div>
    </div>
  )
}
```

### 2. Composant Register

**Créer** : `app/src/components/Register.jsx`

```javascript
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Register({ onSwitch }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup, loginWithGoogle } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()

    if (password !== confirmPassword) {
      return setError('Les mots de passe ne correspondent pas')
    }

    if (password.length < 6) {
      return setError('Le mot de passe doit contenir au moins 6 caractères')
    }

    try {
      setError('')
      setLoading(true)
      await signup(email, password)
    } catch (err) {
      setError('Échec de l\'inscription : ' + err.message)
    }
    setLoading(false)
  }

  async function handleGoogleSignup() {
    try {
      setError('')
      setLoading(true)
      await loginWithGoogle()
    } catch (err) {
      setError('Échec de l\'inscription Google : ' + err.message)
    }
    setLoading(false)
  }

  return (
    <div style={{
      maxWidth: 400,
      margin: '60px auto',
      padding: 32,
      background: 'var(--bg-secondary)',
      borderRadius: 12,
      boxShadow: 'var(--shadow)'
    }}>
      <h2 style={{ margin: '0 0 24px', fontSize: 24, textAlign: 'center' }}>
        Créer un compte
      </h2>

      {error && (
        <div style={{
          padding: 12,
          background: '#fee',
          color: '#c00',
          borderRadius: 6,
          marginBottom: 16,
          fontSize: 14
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 14 }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 6,
              border: '1px solid var(--border)',
              fontSize: 14
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 14 }}>
            Mot de passe
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 6,
              border: '1px solid var(--border)',
              fontSize: 14
            }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 14 }}>
            Confirmer le mot de passe
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 6,
              border: '1px solid var(--border)',
              fontSize: 14
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: 12,
            background: 'var(--accent)',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Création...' : 'Créer mon compte'}
        </button>
      </form>

      <div style={{ margin: '16px 0', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>
        ou
      </div>

      <button
        onClick={handleGoogleSignup}
        disabled={loading}
        style={{
          width: '100%',
          padding: 12,
          background: 'white',
          color: '#333',
          border: '1px solid #ddd',
          borderRadius: 6,
          fontSize: 14,
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8
        }}
      >
        <span>🔍</span> Continuer avec Google
      </button>

      <div style={{ marginTop: 24, textAlign: 'center', fontSize: 14 }}>
        Déjà un compte ?{' '}
        <button
          onClick={onSwitch}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent)',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          Se connecter
        </button>
      </div>
    </div>
  )
}
```

### 3. Modifier App.jsx pour gérer l'auth

**Éditer** : `app/src/App.jsx`

Ajouter en haut :
```javascript
import { useAuth } from './contexts/AuthContext'
import Login from './components/Login'
import Register from './components/Register'
```

Ajouter dans le composant :
```javascript
const { currentUser, logout } = useAuth()
const [showRegister, setShowRegister] = useState(false)

// Si pas connecté, afficher Login/Register
if (!currentUser) {
  return showRegister
    ? <Register onSwitch={() => setShowRegister(false)} />
    : <Login onSwitch={() => setShowRegister(true)} />
}
```

Ajouter un bouton logout dans le header :
```javascript
<button
  onClick={logout}
  style={{
    padding: '8px 16px',
    background: 'var(--bg-tertiary)',
    border: '1px solid var(--border)',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 13
  }}
>
  Se déconnecter
</button>
```

---

## 🗄️ Phase 4 : Migrer la wishlist vers Firestore (2-3h)

### 1. Structure des données Firestore

**Collections** :
```
users/{userId}
  - email: string
  - displayName: string
  - photoURL: string
  - bio: string
  - createdAt: timestamp

wishlists/{userId}/items/{itemId}
  - id: string (TMDB/OpenLibrary ID)
  - type: 'movie' | 'tv' | 'book'
  - title: string
  - year: number
  - poster: string
  - collection: string
  - rating: number (0-5)
  - review: string
  - notes: string
  - addedAt: timestamp
```

### 2. Créer le service Wishlist

**Créer** : `app/src/services/wishlistService.js`

```javascript
import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '../lib/firebase'

export async function getWishlist(userId) {
  const q = query(
    collection(db, `wishlists/${userId}/items`),
    orderBy('addedAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ ...doc.data(), firestoreId: doc.id }))
}

export async function addToWishlist(userId, item) {
  const itemData = {
    ...item,
    addedAt: serverTimestamp()
  }
  return await addDoc(collection(db, `wishlists/${userId}/items`), itemData)
}

export async function removeFromWishlist(userId, firestoreId) {
  return await deleteDoc(doc(db, `wishlists/${userId}/items`, firestoreId))
}

export async function updateWishlistItem(userId, firestoreId, updates) {
  return await updateDoc(doc(db, `wishlists/${userId}/items`, firestoreId), updates)
}
```

### 3. Adapter App.jsx pour utiliser Firestore

Remplacer :
```javascript
const [wishlist, setWishlist] = useState(() => {
  try { return JSON.parse(localStorage.getItem('ch_wishlist')||'[]') } catch { return [] }
})
```

Par :
```javascript
const [wishlist, setWishlist] = useState([])

useEffect(() => {
  if (currentUser) {
    loadWishlist()
  }
}, [currentUser])

async function loadWishlist() {
  try {
    const items = await getWishlist(currentUser.uid)
    setWishlist(items)
  } catch (err) {
    console.error('Error loading wishlist:', err)
  }
}

async function addToWishlist(item) {
  try {
    await addToWishlist(currentUser.uid, item)
    await loadWishlist() // Recharger
  } catch (err) {
    console.error('Error adding to wishlist:', err)
  }
}
```

---

## 🚀 Phase 5 : Déployer sur Firebase Hosting (30 min)

### 1. Installer Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Login Firebase

```bash
firebase login
```

### 3. Initialiser Firebase dans le projet

```bash
cd project-ideas/culture-hub/app
firebase init
```

Sélectionner :
- ✅ Hosting
- Projet existant : `culture-hub`
- Public directory : `dist`
- Single-page app : **Yes**
- GitHub Actions : **No** (pour l'instant)

### 4. Build & Deploy

```bash
npm run build
firebase deploy
```

Ton app sera disponible sur : `https://culture-hub-xxxxx.web.app`

---

## 📋 Checklist finale

**Setup initial**
- [ ] Projet Firebase créé
- [ ] Auth activée (Email + Google)
- [ ] Firestore créée
- [ ] Storage activé
- [ ] Config copiée dans `.env`

**Code**
- [ ] Firebase SDK installé
- [ ] `firebase.js` créé
- [ ] `AuthContext.jsx` créé
- [ ] `Login.jsx` créé
- [ ] `Register.jsx` créé
- [ ] App.jsx modifié (auth guard)
- [ ] `wishlistService.js` créé
- [ ] Migration localStorage → Firestore

**Tests**
- [ ] Sign up fonctionne
- [ ] Login fonctionne
- [ ] Login Google fonctionne
- [ ] Logout fonctionne
- [ ] Wishlist sauvegardée dans Firestore
- [ ] Wishlist persiste après refresh

**Déploiement**
- [ ] Firebase CLI installé
- [ ] Build réussit
- [ ] Deploy réussit
- [ ] App accessible en production

---

## 🆘 Troubleshooting

**Erreur "Firebase: Error (auth/configuration-not-found)"**
→ Vérifier que les variables d'environnement dans `.env` sont bien préfixées par `VITE_`

**Erreur "Missing or insufficient permissions"**
→ Configurer les Firestore Rules (voir section suivante)

**Login Google ne fonctionne pas**
→ Ajouter le domaine autorisé dans Firebase Console → Authentication → Settings → Authorized domains

---

## 🔒 Firestore Security Rules (IMPORTANT)

Dans Firebase Console → Firestore → Rules :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if true; // Profils publics
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Wishlists
    match /wishlists/{userId}/items/{itemId} {
      allow read: if true; // Wishlists publiques
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

**Prêt à coder ! 🔥**
