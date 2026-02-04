import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Register({ onSwitch }) {
  const [displayName, setDisplayName] = useState('')
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

    if (!displayName.trim()) {
      return setError('Le nom d\'affichage est requis')
    }

    try {
      setError('')
      setLoading(true)
      await signup(email, password, displayName)
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Cet email est déjà utilisé')
      } else if (err.code === 'auth/invalid-email') {
        setError('Email invalide')
      } else if (err.code === 'auth/weak-password') {
        setError('Mot de passe trop faible')
      } else {
        setError('Échec de l\'inscription : ' + err.message)
      }
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
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ margin: 0, fontSize: 32, marginBottom: 8 }}>🎬 culture hub V1.23</h1>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: 'var(--text-primary)' }}>
          Créer un compte
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
            Nom d'affichage
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            placeholder="Mathieu Jardin"
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

        <div style={{ marginBottom: 16 }}>
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
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
            Minimum 6 caractères
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 500 }}>
            Confirmer le mot de passe
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          {loading ? 'Création du compte...' : 'Créer mon compte'}
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
        onClick={handleGoogleSignup}
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
        <span style={{ color: 'var(--text-secondary)' }}>Déjà un compte ?{' '}</span>
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
          Se connecter
        </button>
      </div>
    </div>
  )
}
