import React, { useState } from 'react'
import { mergeUserData } from '../services/accountMergeService'

export default function AccountMerge({ email, methods, onMerge, onCancel }) {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const hasEmailPassword = methods.includes('password')
  const hasGoogle = methods.includes('google.com')

  async function handleMerge() {
    if (!password && hasEmailPassword) {
      setError('Mot de passe requis')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Appeler la fonction de fusion
      await onMerge(password)
    } catch (err) {
      setError(err.message || 'Erreur lors de la fusion des comptes')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'var(--bg-secondary)',
        padding: 32,
        borderRadius: 12,
        maxWidth: 500,
        width: '90%',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
      }}>
        <h2 style={{ margin: '0 0 16px', fontSize: 20, color: 'var(--text-primary)' }}>
          🔗 Fusionner les comptes
        </h2>

        <p style={{ marginBottom: 20, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Nous avons détecté que vous avez <strong>plusieurs comptes</strong> avec l'email{' '}
          <strong style={{ color: 'var(--accent)' }}>{email}</strong> :
        </p>

        <div style={{
          background: 'var(--bg-tertiary)',
          padding: 16,
          borderRadius: 8,
          marginBottom: 20
        }}>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {hasEmailPassword && (
              <li style={{ marginBottom: 8, color: 'var(--text-primary)' }}>
                ✉️ Compte <strong>Email/Password</strong>
              </li>
            )}
            {hasGoogle && (
              <li style={{ color: 'var(--text-primary)' }}>
                🔍 Compte <strong>Google</strong>
              </li>
            )}
          </ul>
        </div>

        <p style={{ marginBottom: 20, color: 'var(--text-secondary)', fontSize: 14 }}>
          Voulez-vous <strong>fusionner ces comptes</strong> en un seul ?
          Toutes vos données (wishlists, profil) seront conservées.
        </p>

        {hasEmailPassword && (
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>
              Mot de passe du compte Email
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez votre mot de passe"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 6,
                border: '1px solid var(--border)',
                fontSize: 14,
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)'
              }}
            />
            <p style={{ margin: '8px 0 0', fontSize: 12, color: 'var(--text-light)' }}>
              Pour vérifier que c'est bien vous
            </p>
          </div>
        )}

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

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              flex: 1,
              padding: 12,
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              color: 'var(--text-primary)'
            }}
          >
            Annuler
          </button>
          <button
            onClick={handleMerge}
            disabled={loading || (hasEmailPassword && !password)}
            style={{
              flex: 1,
              padding: 12,
              background: 'var(--accent)',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              cursor: (loading || (hasEmailPassword && !password)) ? 'not-allowed' : 'pointer',
              opacity: (loading || (hasEmailPassword && !password)) ? 0.6 : 1
            }}
          >
            {loading ? 'Fusion en cours...' : 'Fusionner'}
          </button>
        </div>

        <p style={{
          marginTop: 16,
          fontSize: 12,
          color: 'var(--text-light)',
          textAlign: 'center'
        }}>
          ℹ️ Après la fusion, vous pourrez utiliser les deux méthodes de connexion
        </p>
      </div>
    </div>
  )
}
