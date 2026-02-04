import React, { useEffect, useMemo, useState } from 'react'
import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, setDoc, where } from 'firebase/firestore'
import { db } from '../lib/firebase'

async function loadUsersByIds(ids) {
  const unique = [...new Set(ids)].filter(Boolean)
  if (unique.length === 0) return []
  const docs = await Promise.all(unique.map(id => getDoc(doc(db, 'users', id))))
  return docs
    .filter(d => d.exists())
    .map(d => ({ id: d.id, ...d.data() }))
}

export default function FriendsPanel({ currentUser, onOpenProfile }) {
  const [followingIds, setFollowingIds] = useState([])
  const [followerIds, setFollowerIds] = useState([])
  const [followingUsers, setFollowingUsers] = useState([])
  const [followerUsers, setFollowerUsers] = useState([])
  const [searchText, setSearchText] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')
  const [pendingIds, setPendingIds] = useState({})

  useEffect(() => {
    if (!currentUser) return
    const qFollowing = query(collection(db, 'follows'), where('followerId', '==', currentUser.uid))
    const qFollowers = query(collection(db, 'follows'), where('followeeId', '==', currentUser.uid))

    const unsubFollowing = onSnapshot(qFollowing, (snap) => {
      setFollowingIds(snap.docs.map(d => d.data().followeeId))
    })
    const unsubFollowers = onSnapshot(qFollowers, (snap) => {
      setFollowerIds(snap.docs.map(d => d.data().followerId))
    })

    return () => {
      unsubFollowing()
      unsubFollowers()
    }
  }, [currentUser])

  useEffect(() => {
    let cancelled = false
    loadUsersByIds(followingIds).then((users) => {
      if (!cancelled) setFollowingUsers(users)
    })
    return () => { cancelled = true }
  }, [followingIds])

  useEffect(() => {
    let cancelled = false
    loadUsersByIds(followerIds).then((users) => {
      if (!cancelled) setFollowerUsers(users)
    })
    return () => { cancelled = true }
  }, [followerIds])

  const followingSet = useMemo(() => new Set(followingIds), [followingIds])

  async function handleSearch(e) {
    e.preventDefault()
    const term = searchText.trim()
    if (!term) return
    setSearching(true)
    setError('')
    try {
      const results = []
      if (term.includes('@')) {
        const byEmail = query(collection(db, 'users'), where('email', '==', term))
        const snap = await getDocs(byEmail)
        snap.forEach(docSnap => results.push({ id: docSnap.id, ...docSnap.data() }))
      }
      const start = term
      const end = `${term}\uf8ff`
      const byName = query(collection(db, 'users'), where('displayName', '>=', start), where('displayName', '<=', end))
      const nameSnap = await getDocs(byName)
      nameSnap.forEach(docSnap => results.push({ id: docSnap.id, ...docSnap.data() }))

      const unique = []
      const seen = new Set()
      results.forEach((user) => {
        if (user.id === currentUser.uid) return
        if (seen.has(user.id)) return
        seen.add(user.id)
        unique.push(user)
      })
      setSearchResults(unique)
    } catch (err) {
      console.error(err)
      setError('Erreur lors de la recherche')
    } finally {
      setSearching(false)
    }
  }

  async function follow(userId) {
    if (!currentUser) return
    setPendingIds(prev => ({ ...prev, [userId]: true }))
    try {
      await setDoc(doc(db, 'follows', `${currentUser.uid}_${userId}`), {
        followerId: currentUser.uid,
        followeeId: userId,
        createdAt: new Date()
      })
    } finally {
      setPendingIds(prev => ({ ...prev, [userId]: false }))
    }
  }

  async function unfollow(userId) {
    if (!currentUser) return
    setPendingIds(prev => ({ ...prev, [userId]: true }))
    try {
      await deleteDoc(doc(db, 'follows', `${currentUser.uid}_${userId}`))
    } finally {
      setPendingIds(prev => ({ ...prev, [userId]: false }))
    }
  }

  function renderUserRow(user) {
    const isFollowing = followingSet.has(user.id)
    return (
      <div key={user.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
            {user.displayName || user.email?.split('@')[0] || 'Utilisateur'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-light)' }}>{user.email}</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => onOpenProfile && onOpenProfile(user.id)}
            style={{ fontSize: 11, padding: '4px 8px' }}
          >
            Profil
          </button>
          {isFollowing ? (
            <button
              onClick={() => unfollow(user.id)}
              disabled={pendingIds[user.id]}
              style={{ fontSize: 11, padding: '4px 8px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
            >
              {pendingIds[user.id] ? '...' : 'Se désabonner'}
            </button>
          ) : (
            <button
              onClick={() => follow(user.id)}
              disabled={pendingIds[user.id]}
              style={{ fontSize: 11, padding: '4px 8px' }}
            >
              {pendingIds[user.id] ? '...' : 'Suivre'}
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <section style={{ marginTop: 16, padding: 16, background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border-color)' }}>
      <h3 style={{ margin: '0 0 12px', color: 'var(--text-primary)', fontSize: 16, fontWeight: 600 }}>🤝 Amis</h3>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Rechercher par email ou nom..."
          style={{ fontSize: 12, flex: 1 }}
        />
        <button type="submit" disabled={searching} style={{ fontSize: 12 }}>
          {searching ? '...' : 'Chercher'}
        </button>
      </form>
      {error && <div style={{ fontSize: 12, color: '#dc2626', marginBottom: 8 }}>{error}</div>}
      {searchResults.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: 'var(--text-light)', marginBottom: 6 }}>Résultats</div>
          {searchResults.map(renderUserRow)}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-light)', marginBottom: 6 }}>
            Abonnements ({followingUsers.length})
          </div>
          {followingUsers.length === 0 && <div style={{ fontSize: 12, color: 'var(--text-light)' }}>Aucun</div>}
          {followingUsers.map(renderUserRow)}
        </div>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-light)', marginBottom: 6 }}>
            Abonnés ({followerUsers.length})
          </div>
          {followerUsers.length === 0 && <div style={{ fontSize: 12, color: 'var(--text-light)' }}>Aucun</div>}
          {followerUsers.map(renderUserRow)}
        </div>
      </div>
    </section>
  )
}
