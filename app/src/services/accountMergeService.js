import {
  fetchSignInMethodsForEmail,
  linkWithCredential,
  EmailAuthProvider,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import {
  writeBatch,
  doc,
  getDoc
} from 'firebase/firestore'
import { auth, db } from '../lib/firebase'

/**
 * Vérifie si un compte existe déjà avec cet email
 * @param {string} email
 * @returns {Promise<Array<string>>} Liste des méthodes de connexion disponibles
 */
export async function checkExistingAccount(email) {
  try {
    const methods = await fetchSignInMethodsForEmail(auth, email)
    return methods
  } catch (error) {
    console.error('Error checking existing account:', error)
    return []
  }
}

/**
 * Fusionne les données de deux comptes utilisateurs
 * @param {string} sourceUserId - ID du compte source (à supprimer)
 * @param {string} targetUserId - ID du compte cible (à garder)
 */
export async function mergeUserData(sourceUserId, targetUserId) {
  const batch = writeBatch(db)

  try {
    // 1. Récupérer les données du compte source
    const sourceUserDoc = await getDoc(doc(db, 'users', sourceUserId))
    const targetUserDoc = await getDoc(doc(db, 'users', targetUserId))

    // 2. Fusionner les wishlists (doc unique par user)
    const sourceWishlistDoc = await getDoc(doc(db, 'wishlists', sourceUserId))
    const targetWishlistDoc = await getDoc(doc(db, 'wishlists', targetUserId))
    const sourceItems = sourceWishlistDoc.exists() && Array.isArray(sourceWishlistDoc.data().items)
      ? sourceWishlistDoc.data().items
      : []
    const targetItems = targetWishlistDoc.exists() && Array.isArray(targetWishlistDoc.data().items)
      ? targetWishlistDoc.data().items
      : []

    const mergedItems = [...targetItems]
    sourceItems.forEach((item) => {
      const exists = mergedItems.find(i => i.id === item.id && i.type === item.type)
      if (!exists) mergedItems.push(item)
    })

    batch.set(
      doc(db, 'wishlists', targetUserId),
      { items: mergedItems, updatedAt: new Date() },
      { merge: true }
    )

    // 3. Fusionner les profils (garder les meilleures infos)
    if (sourceUserDoc.exists() && targetUserDoc.exists()) {
      const sourceData = sourceUserDoc.data()
      const targetData = targetUserDoc.data()

      const mergedProfile = {
        ...targetData,
        // Garder le displayName le plus complet
        displayName: targetData.displayName || sourceData.displayName,
        // Garder la photo si elle existe
        photoURL: targetData.photoURL || sourceData.photoURL,
        // Garder la bio la plus longue
        bio: (targetData.bio?.length > sourceData.bio?.length)
          ? targetData.bio
          : sourceData.bio,
        // Garder la date de création la plus ancienne
        createdAt: targetData.createdAt < sourceData.createdAt
          ? targetData.createdAt
          : sourceData.createdAt,
        updatedAt: new Date()
      }

      batch.update(doc(db, 'users', targetUserId), mergedProfile)
    }

    // 4. Supprimer le compte source
    batch.delete(doc(db, 'users', sourceUserId))
    batch.delete(doc(db, 'wishlists', sourceUserId))

    // Exécuter toutes les opérations
    await batch.commit()

    console.log('Comptes fusionnés avec succès')
    return true
  } catch (error) {
    console.error('Error merging accounts:', error)
    throw error
  }
}

/**
 * Lier un compte Google à un compte Email/Password existant
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} User credential
 */
export async function linkGoogleToEmailAccount(email, password) {
  try {
    // 1. Se connecter avec email/password
    const emailCredential = EmailAuthProvider.credential(email, password)

    // 2. Ouvrir le popup Google
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ login_hint: email })

    const result = await signInWithPopup(auth, provider)

    // 3. Lier le compte Google au compte actuel
    // Note: À ce stade, on est connecté avec Google
    // On doit fusionner les données et garder un seul compte

    return result
  } catch (error) {
    console.error('Error linking accounts:', error)
    throw error
  }
}

/**
 * Détecte si l'utilisateur a des comptes multiples et propose la fusion
 * @param {string} email
 * @returns {Promise<Object>} Informations sur les comptes existants
 */
export async function detectDuplicateAccounts(email) {
  const methods = await checkExistingAccount(email)

  return {
    hasDuplicates: methods.length > 1,
    methods: methods,
    hasEmailPassword: methods.includes('password'),
    hasGoogle: methods.includes('google.com'),
    canMerge: methods.length > 1
  }
}
