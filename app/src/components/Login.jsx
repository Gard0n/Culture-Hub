import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AccountMerge from './AccountMerge'

export default function Login({ onSwitch }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showMergeModal, setShowMergeModal] = useState(false)
  const [duplicateInfo, setDuplicateInfo] = useState(null)
  const { login, loginWithGoogle, checkDuplicates, mergeAccounts } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      setError('')
      setLoading(true)
      await login(email, password)
    } catch (err) {
      setError('Échec de la connexion : ' + (err.message || 'Vérifiez vos identifiants'))
    }
    setLoading(false)
  }

  async function handleGoogleLogin() {
    try {
      setError('')
      setLoading(true)
      const result = await loginWithGoogle()

      // Vérifier s'il y a des comptes en doublon
      const userEmail = result.user.email
      const duplicates = await checkDuplicates(userEmail)

      if (duplicates.hasDuplicates) {
        // Afficher le modal de fusion
        setDuplicateInfo({
          email: userEmail,
          methods: duplicates.methods
        })
        setShowMergeModal(true)
      }
    } catch (err) {
      // Si l'erreur indique qu'un compte existe déjà
      if (err.message.includes('compte existe déjà')) {
        setError(err.message)
      } else {
        setError('Échec de la connexion Google : ' + err.message)
      }
    }
    setLoading(false)
  }

  async function handleMerge(password) {
    try {
      setLoading(true)
      await mergeAccounts(duplicateInfo.email, password)
      setShowMergeModal(false)
      setDuplicateInfo(null)
      // L'utilisateur est maintenant connecté avec les comptes fusionnés
    } catch (err) {
      throw new Error('Erreur lors de la fusion : ' + err.message)
    } finally {
      setLoading(false)
    }
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
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ margin: 0, fontSize: 32, marginBottom: 8 }}>🎬 culture hub V1.20</h1>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: 'var(--text-primary)' }}>
          Connexion
        </h2>
      </div>

      {error && (
        <div style={{
          padding: 12,
          background: '#fee',
          color: '#c00',
          borderRadius: 6,
          marginBottom: 16,
          fontSize: 14,
          border: '1px solid #fcc'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 500 }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="ton@email.com"
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
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 500 }}>
            Mot de passe
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
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
            opacity: loading ? 0.6 : 1,
            transition: 'opacity 0.2s'
          }}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>

      <div style={{
        margin: '20px 0',
        textAlign: 'center',
        color: 'var(--text-secondary)',
        fontSize: 14,
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }}>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }}></div>
        <span>ou</span>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }}></div>
      </div>

      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        type="button"
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
          gap: 8,
          transition: 'all 0.2s'
        }}
        onMouseOver={(e) => {
          if (!loading) e.currentTarget.style.background = '#f9f9f9'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'white'
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
          <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
          <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.335z"/>
          <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
        </svg>
        Continuer avec Google
      </button>

      <div style={{ marginTop: 24, textAlign: 'center', fontSize: 14 }}>
        <span style={{ color: 'var(--text-secondary)' }}>Pas encore de compte ?{' '}</span>
        <button
          onClick={onSwitch}
          type="button"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent)',
            cursor: 'pointer',
            textDecoration: 'underline',
            fontSize: 14,
            fontWeight: 600
          }}
        >
          S'inscrire
        </button>
      </div>

      {showMergeModal && duplicateInfo && (
        <AccountMerge
          email={duplicateInfo.email}
          methods={duplicateInfo.methods}
          onMerge={handleMerge}
          onCancel={() => {
            setShowMergeModal(false)
            setDuplicateInfo(null)
          }}
        />
      )}
    </div>
  )
}
