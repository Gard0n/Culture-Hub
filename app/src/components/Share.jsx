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

export default function Share({ wishlist }) {
  const [copied, setCopied] = useState(false)

  const encoded = encodeWishlist(wishlist)
  const shareUrl = `${window.location.origin}${window.location.pathname}#list=${encoded}`

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section style={{ marginTop: 16, padding: 16, background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border-color)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>🔗 Partager cette wishlist</h3>
        <button 
          onClick={handleCopy} 
          style={{ 
            background: copied ? '#4caf50' : 'var(--btn-bg)', 
            padding: '6px 14px',
            fontSize: 12,
            fontWeight: 600
          }}
        >
          {copied ? '✅ Copié!' : 'Copier'}
        </button>
      </div>
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
      <p style={{ margin: '8px 0 0', fontSize: 12, color: 'var(--text-light)' }}>
        Partage ce lien pour que d'autres voient ta wishlist! 🎬📚
      </p>
    </section>
  )
}

export { decodeWishlist }
