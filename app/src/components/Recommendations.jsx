import React, { useState, useEffect } from 'react'

export default function Recommendations({ wishlist, onAdd, onSelect }) {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (wishlist.length === 0) return

    async function loadSuggestions() {
      setLoading(true)
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY
        const lang = import.meta.env.VITE_TMDB_LANGUAGE || 'fr-FR'
        if (!apiKey) return

        // Grouper par genre/année
        const years = [...new Set(wishlist.map(i => i.year).filter(Boolean))]
        const recentYear = years.length > 0 ? Math.max(...years.map(Number)) : new Date().getFullYear()

        // Chercher des films/séries populaires proches des années
        const baseUrl = 'https://api.themoviedb.org/3'
        const results = []

        // Requête pour films populaires
        try {
          const movieRes = await fetch(`${baseUrl}/discover/movie?api_key=${apiKey}&language=${lang}&sort_by=popularity.desc&primary_release_year=${recentYear}&page=1`)
          const movieData = await movieRes.json()
          if (movieData.results) {
            results.push(...movieData.results.slice(0, 3).map(item => ({
              id: item.id,
              type: 'movie',
              title: item.title || item.name,
              year: (item.release_date || '').slice(0, 4),
              poster: item.poster_path
            })))
          }
        } catch (e) { console.warn(e) }

        // Requête pour séries populaires
        try {
          const tvRes = await fetch(`${baseUrl}/discover/tv?api_key=${apiKey}&language=${lang}&sort_by=popularity.desc&first_air_date_year=${recentYear}&page=1`)
          const tvData = await tvRes.json()
          if (tvData.results) {
            results.push(...tvData.results.slice(0, 3).map(item => ({
              id: item.id,
              type: 'tv',
              title: item.title || item.name,
              year: (item.first_air_date || '').slice(0, 4),
              poster: item.poster_path
            })))
          }
        } catch (e) { console.warn(e) }

        // Retirer les doublons
        const unique = results.filter(
          r => !wishlist.find(w => w.id === r.id && w.type === r.type)
        )
        setSuggestions(unique.slice(0, 6))
      } finally {
        setLoading(false)
      }
    }

    loadSuggestions()
  }, [wishlist])

  if (!import.meta.env.VITE_TMDB_API_KEY || suggestions.length === 0) return null

  return (
    <section style={{ marginTop: 24, padding: 16, background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border-color)' }}>
      <h3 style={{ margin: '0 0 12px', color: 'var(--text-primary)', fontSize: 16, fontWeight: 600 }}>💡 Recommandations pour toi</h3>
      {loading ? (
        <p style={{ color: 'var(--text-light)' }}>Chargement...</p>
      ) : (
        <div className="media-grid media-grid-compact">
          {suggestions.map(s => (
            <div key={s.id + '-' + s.type} className="media-card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => onSelect && onSelect(s)}>
              {s.poster ? (
                <img src={`https://image.tmdb.org/t/p/w185${s.poster}`} alt={s.title} style={{ width: '100%', borderRadius: 6, height: 160, objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: 160, background: 'var(--bg-tertiary)', borderRadius: 6 }} />
              )}
              <div className="media-card-info" style={{ marginTop: 6 }}>
                <div style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text-light)' }}>{s.creator || 'Réalisateur inconnu'}</div>
                <span className="tap-hint mobile-only">Tap pour détails</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
