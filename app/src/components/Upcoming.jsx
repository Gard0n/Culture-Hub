import React, { useEffect, useState } from 'react'
import { fetchUpcomingMovies, posterUrl } from '../api/tmdb'

export default function Upcoming({ onSelect, onAdd }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        setLoading(true)
        const apiKey = import.meta.env.VITE_TMDB_API_KEY
        const lang = import.meta.env.VITE_TMDB_LANGUAGE || 'fr-FR'
        const res = await fetchUpcomingMovies(apiKey, 1, lang)
        if (!mounted) return
        setItems(res && res.results ? res.results : (res || []))
        setError(null)
      } catch (e) {
        if (!mounted) return
        console.error(e)
        setError('Erreur lors du chargement des sorties.')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [])

  return (
    <section className="upcoming">
      <h2>Ce qui sort bientôt</h2>
      {loading && <p>Chargement…</p>}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      <div className="media-grid upcoming-grid">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton-card card skeleton" />
          ))
        ) : (
          (items.slice ? items.slice(0, 12) : items).map(it => (
            <div
              key={it.id}
              className="card media-card"
              role="button"
              tabIndex={0}
              onClick={() => onSelect && onSelect({ id: it.id, type: 'movie', title: it.title || it.name, year: (it.release_date || it.first_air_date || '').slice(0, 4), poster: it.poster_path })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSelect && onSelect({ id: it.id, type: 'movie', title: it.title || it.name, year: (it.release_date || it.first_air_date || '').slice(0, 4), poster: it.poster_path })
              }}
              style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', padding: 8, borderRadius: 6, display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow)', cursor: 'pointer' }}
            >
              {it.poster_path ? (
                <img src={posterUrl(it.poster_path, 'w185')} alt="poster" style={{ width: '100%', borderRadius: 4, marginBottom: 8 }} />
              ) : (
                <div style={{ width: '100%', height: 200, background: 'var(--bg-secondary)', borderRadius: 4, marginBottom: 8 }} />
              )}
              <div className="media-card-info">
                <strong style={{ fontSize: 14, color: 'var(--text-primary)' }}>{it.title || it.name}</strong>
                <small style={{ color: 'var(--text-light)' }}>{(it.release_date || it.first_air_date || '').slice(0, 4)}</small>
              </div>
              <div className="media-card-actions mobile-hide" style={{ marginTop: 8 }}>
                <button
                  aria-label={`Voir détails ${it.title || it.name}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelect && onSelect({ id: it.id, type: 'movie', title: it.title || it.name, year: (it.release_date || it.first_air_date || '').slice(0, 4), poster: it.poster_path })
                  }}
                >
                  Détails
                </button>
                <button
                  aria-label={`Ajouter ${it.title || it.name}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (onAdd) onAdd({ id: it.id, type: 'movie', title: it.title || it.name, year: (it.release_date || it.first_air_date || '').slice(0, 4), poster: it.poster_path })
                    try {
                      const key = 'ch_notifications'
                      const cur = JSON.parse(localStorage.getItem(key) || '[]')
                      cur.unshift({ title: `Ajouté: ${it.title || it.name}`, body: `Sortie prévue le ${it.release_date || it.first_air_date || ''}`, createdAt: new Date().toISOString() })
                      localStorage.setItem(key, JSON.stringify(cur))
                    } catch (e2) { console.error(e2) }
                  }}
                  style={{ marginLeft: 8 }}
                >
                  Ajouter
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
