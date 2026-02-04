import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  EmailAuthProvider,
  linkWithCredential,
  signInWithCredential
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import { checkExistingAccount, mergeUserData } from '../services/accountMergeService'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Sign up with email/password
  async function signup(email, password, displayName) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Update profile with display name
    if (displayName) {
      await updateProfile(user, { displayName })
      // Force refresh currentUser
      await user.reload()
      setCurrentUser(auth.currentUser)
    }

    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      displayName: displayName || user.email.split('@')[0],
      photoURL: null, // Pas de Storage pour l'instant
      bio: '',
      publicProfile: false,
      themeColor: '#475569',
      avatarUrl: '',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return userCredential
  }

  // Login with email/password
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  // Login with Google
  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider()

    try {
      const userCredential = await signInWithPopup(auth, provider)
      const user = userCredential.user

      // Check if user document exists, if not create it
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          displayName: user.displayName || user.email.split('@')[0],
          photoURL: user.photoURL || null,
          bio: '',
          publicProfile: false,
          themeColor: '#475569',
          avatarUrl: user.photoURL || '',
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }

      return userCredential
    } catch (error) {
      // Si le compte existe déjà avec email/password, on peut suggérer de lier
      if (error.code === 'auth/account-exists-with-different-credential') {
        throw new Error('Un compte existe déjà avec cet email. Connecte-toi avec email/password pour lier les comptes.')
      }
      throw error
    }
  }

  // Logout
  function logout() {
    return signOut(auth)
  }

  // Merge accounts (Google + Email/Password)
  async function mergeAccounts(email, password) {
    try {
      // 1. Sauvegarder l'ID du compte Google actuel
      const googleUser = auth.currentUser
      if (!googleUser) {
        throw new Error('Vous devez être connecté avec Google')
      }
      const googleUserId = googleUser.uid

      // 2. Se déconnecter du compte Google
      await signOut(auth)

      // 3. Se connecter avec Email/Password
      const emailCredential = await signInWithEmailAndPassword(auth, email, password)
      const emailUser = emailCredential.user
      const emailUserId = emailUser.uid

      // 4. Créer la credential Google
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({ login_hint: email })
      const result = await signInWithPopup(auth, provider)
      const googleCredential = GoogleAuthProvider.credentialFromResult(result)

      // 5. Lier le compte Google au compte Email/Password
      if (googleCredential) {
        await linkWithCredential(emailUser, googleCredential)
      }

      // 6. Fusionner les données Firestore
      await mergeUserData(googleUserId, emailUserId)

      // 7. Recharger l'utilisateur
      await emailUser.reload()
      setCurrentUser(auth.currentUser)

      return { success: true, userId: emailUserId }
    } catch (error) {
      console.error('Error merging accounts:', error)
      throw error
    }
  }

  // Check if user has duplicate accounts
  async function checkDuplicates(email) {
    const methods = await checkExistingAccount(email)
    return {
      hasDuplicates: methods.length > 1,
      methods: methods
    }
  }

  // Get user initials for avatar
  function getUserInitials(user) {
    if (!user) return '?'
    const name = user.displayName || user.email
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
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
    logout,
    getUserInitials,
    mergeAccounts,
    checkDuplicates
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
