import React, { useEffect, useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { updateProfile } from 'firebase/auth'
import { auth, db } from '../lib/firebase'

export default function ProfilePanel({ currentUser, profile }) {
  const [displayName, setDisplayName] = useState(profile?.displayName || '')
  const [bio, setBio] = useState(profile?.bio || '')
  const [publicProfile, setPublicProfile] = useState(Boolean(profile?.publicProfile))
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!profile) return
    setDisplayName(profile.displayName || '')
    setBio(profile.bio || '')
    setPublicProfile(Boolean(profile.publicProfile))
  }, [profile])

  const profileUrl = currentUser
    ? `${window.location.origin}${window.location.pathname}#profile=${currentUser.uid}`
    : ''

  async function handleSave(e) {
    e.preventDefault()
    if (!currentUser) return
    setSaving(true)
    setSaved(false)
    setError('')
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        displayName: displayName.trim(),
        bio: bio.trim(),
        publicProfile: Boolean(publicProfile),
        updatedAt: new Date()
      })
      if (auth.currentUser && displayName.trim() && auth.currentUser.displayName !== displayName.trim()) {
        await updateProfile(auth.currentUser, { displayName: displayName.trim() })
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 1500)
    } catch (err) {
      console.error(err)
      setError('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(profileUrl)
      setSaved(true)
      setTimeout(() => setSaved(false), 1200)
    } catch (err) {
      console.error(err)
      setError('Impossible de copier le lien')
    }
  }

  return (
    <section style={{ marginTop: 16, padding: 16, background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border-color)' }}>
      <h3 style={{ margin: '0 0 12px', color: 'var(--text-primary)', fontSize: 16, fontWeight: 600 }}>👤 Mon profil</h3>
      <form onSubmit={handleSave} style={{ display: 'grid', gap: 10 }}>
        <div>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 12, color: 'var(--text-light)' }}>Nom d'affichage</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Ton nom public"
            style={{ fontSize: 12 }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 12, color: 'var(--text-light)' }}>Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Quelques mots sur toi..."
            rows={3}
            style={{ fontSize: 12 }}
          />
        </div>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12 }}>
          <input
            type="checkbox"
            checked={publicProfile}
            onChange={(e) => setPublicProfile(e.target.checked)}
          />
          Rendre mon profil public
        </label>
        {publicProfile && profileUrl && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <input type="text" readOnly value={profileUrl} style={{ fontSize: 11, flex: 1 }} onClick={(e) => e.target.select()} />
            <button type="button" onClick={handleCopy} style={{ fontSize: 12 }}>Copier</button>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button type="submit" disabled={saving}>{saving ? 'Sauvegarde...' : 'Sauvegarder'}</button>
          {saved && <span style={{ fontSize: 12, color: '#16a34a' }}>OK</span>}
          {error && <span style={{ fontSize: 12, color: '#dc2626' }}>{error}</span>}
        </div>
      </form>
    </section>
  )
}
