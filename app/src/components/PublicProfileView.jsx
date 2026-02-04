import React from 'react'
import { posterUrl } from '../api/tmdb'

export default function PublicProfileView({ profile, wishlist, loading, error, onClose }) {
  const totalByType = wishlist.reduce((acc, item) => ({
    ...acc,
    [item.type]: (acc[item.type] || 0) + 1
  }), {})

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 16
    }}>
      <div style={{
        background: 'var(--bg-primary)',
        borderRadius: 8,
        width: '90%',
        maxWidth: 1000,
        maxHeight: '90vh',
        overflow: 'auto',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 20,
          borderBottom: '1px solid var(--border-color)',
          position: 'sticky',
          top: 0,
          background: 'var(--bg-primary)',
          zIndex: 1
        }}>
          <div>
            <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: 24 }}>👤 {profile?.displayName || 'Profil'}</h2>
            <p style={{ margin: '8px 0 0', color: 'var(--text-light)', fontSize: 12 }}>
              {profile?.bio || 'Aucune bio pour le moment.'}
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'var(--btn-bg)',
            border: 'none',
            color: 'var(--btn-text)',
            padding: '8px 12px',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 16
          }}>×</button>
        </div>

        {loading ? (
          <div style={{ padding: 20, color: 'var(--text-light)' }}>Chargement…</div>
        ) : error ? (
          <div style={{ padding: 20, color: '#dc2626' }}>{error}</div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, padding: 20, borderBottom: '1px solid var(--border-color)' }}>
              {Object.entries(totalByType).map(([type, count]) => (
                <div key={type} style={{
                  background: 'var(--bg-secondary)',
                  padding: 12,
                  borderRadius: 6,
                  textAlign: 'center',
                  border: '1px solid var(--border-color)'
                }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent)' }}>{count}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 4 }}>
                    {type === 'movie' ? '🎬 Films' : type === 'tv' ? '📺 Séries' : '📚 Livres'}
                  </div>
                </div>
              ))}
              {wishlist.length === 0 && (
                <div style={{ fontSize: 12, color: 'var(--text-light)' }}>Aucun item public</div>
              )}
            </div>

            <div style={{ padding: 20 }}>
              <div className="media-grid">
                {wishlist.map(item => (
                  <div key={item.id + '-' + item.type} className="media-card" style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: 8,
                    overflow: 'hidden',
                    border: '1px solid var(--border-color)'
                  }}>
                    {item.poster ? (
                      <img src={posterUrl(item.poster, 'w185')} alt={item.title} style={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover'
                      }} />
                    ) : (
                      <div style={{ width: '100%', height: 200, background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 32 }}>
                          {item.type === 'movie' ? '🎬' : item.type === 'tv' ? '📺' : '📚'}
                        </span>
                      </div>
                    )}
                    <div className="media-card-info" style={{ padding: 12 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-light)', marginBottom: 8 }}>
                        {item.year || ''}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
