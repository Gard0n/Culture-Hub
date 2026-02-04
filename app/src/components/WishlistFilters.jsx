import React, { useEffect, useState } from 'react'

export default function WishlistFilters({ wishlist, onFilter, selectedCollection }) {
  const [searchText, setSearchText] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterYear, setFilterYear] = useState('')
  const [open, setOpen] = useState(() => window.innerWidth > 768)

  const years = [...new Set(wishlist.map(i => i.year).filter(Boolean))].sort().reverse()
  const types = ['movie', 'tv', 'book']

  function applyFilters() {
    let filtered = wishlist
    if (selectedCollection) {
      filtered = filtered.filter(i => (i.collection || 'default') === selectedCollection)
    }
    if (searchText) {
      filtered = filtered.filter(i => 
        (i.title?.toLowerCase().includes(searchText.toLowerCase())) ||
        (i.authors?.some(a => a?.toLowerCase().includes(searchText.toLowerCase())))
      )
    }
    if (filterType) {
      filtered = filtered.filter(i => i.type === filterType)
    }
    if (filterYear) {
      filtered = filtered.filter(i => i.year === parseInt(filterYear))
    }
    onFilter(filtered)
  }

  // Auto-apply filters when inputs change
  React.useEffect(applyFilters, [searchText, filterType, filterYear, wishlist, selectedCollection])

  useEffect(() => {
    const media = window.matchMedia('(min-width: 769px)')
    const handler = (e) => setOpen(e.matches)
    handler(media)
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [])

  return (
    <div className="dropdown-section" style={{ padding: 12, background: 'var(--bg-secondary)', borderRadius: 8, marginBottom: 12 }}>
      <button
        type="button"
        className="dropdown-toggle"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        🔍 Filtres {open ? '▴' : '▾'}
      </button>
      {open && (
        <div className="dropdown-content" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h3 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>🔍 Filtrer</h3>
          <input
            type="text"
            placeholder="Rechercher par titre..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ fontSize: 12 }}
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{ fontSize: 12 }}
          >
            <option value="">Tous les types</option>
            {types.map(t => (
              <option key={t} value={t}>
                {t === 'movie' ? '🎬 Films' : t === 'tv' ? '📺 Séries' : '📚 Livres'}
              </option>
            ))}
          </select>
          {years.length > 0 && (
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              style={{ fontSize: 12 }}
            >
              <option value="">Toutes les années</option>
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          )}
        </div>
      )}
    </div>
  )
}
