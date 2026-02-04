import React, { useState } from 'react'

function encodeWishlist(wishlist) {
  const json = JSON.stringify(wishlist)
  return btoa(unescape(encodeURIComponent(json)))
}

function decodeWishlist(encoded) {
  try {
    const json = decodeURIComponent(escape(atob(encoded)))
    return JSON.parse(json)
  } catch {
    return null
  }
}

export default function Share({ wishlist, publicUrl, onPublish }) {
  const [copied, setCopied] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState('')

  const encoded = encodeWishlist(wishlist)
  const fallbackUrl = `${window.location.origin}${window.location.pathname}#list=${encoded}`
  const shareUrl = publicUrl || fallbackUrl

  async function handleCopy() {
    try {
      setError('')
      if (onPublish && publicUrl) {
        setPublishing(true)
        await onPublish()
      }
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error(err)
      setError('Impossible de copier le lien')
    } finally {
      setPublishing(false)
    }
  }

  return (
    <section style={{ marginTop: 16, padding: 16, background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border-color)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>🔗 Partager cette wishlist</h3>
        <button 
          onClick={handleCopy} 
          disabled={publishing}
          style={{ 
            background: copied ? '#4caf50' : 'var(--btn-bg)', 
            padding: '6px 14px',
            fontSize: 12,
            fontWeight: 600,
            opacity: publishing ? 0.7 : 1,
            cursor: publishing ? 'not-allowed' : 'pointer'
          }}
        >
          {publishing ? 'Publication...' : copied ? '✅ Copié!' : 'Copier'}
        </button>
      </div>
      {publicUrl && (
        <p style={{ margin: '0 0 8px', fontSize: 12, color: 'var(--text-light)' }}>
          Lien public (mis à jour au clic)
        </p>
      )}
      <input
        type="text"
        readOnly
        value={shareUrl}
        onClick={(e) => e.target.select()}
        style={{ 
          width: '100%', 
          padding: 10, 
          fontSize: 12, 
          fontFamily: 'monospace', 
          borderRadius: 4, 
          border: '1px solid var(--border-light)', 
          boxSizing: 'border-box',
          background: 'var(--bg-tertiary)',
          color: 'var(--text-primary)'
        }}
      />
      {error && <p style={{ margin: '8px 0 0', fontSize: 12, color: '#dc2626' }}>{error}</p>}
      <p style={{ margin: '8px 0 0', fontSize: 12, color: 'var(--text-light)' }}>
        Partage ce lien pour que d'autres voient ta wishlist! 🎬📚
      </p>
    </section>
  )
}

export { decodeWishlist }
