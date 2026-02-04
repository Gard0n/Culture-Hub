import React from 'react'

export default function Stats({ wishlist }) {
  if (wishlist.length === 0) return null

  const stats = {
    total: wishlist.length,
    movies: wishlist.filter(i => i.type === 'movie').length,
    tv: wishlist.filter(i => i.type === 'tv').length,
    books: wishlist.filter(i => i.type === 'book').length,
    years: [...new Set(wishlist.map(i => i.year).filter(Boolean))].sort().reverse()
  }

  function downloadCSV() {
    const headers = ['Title', 'Type', 'Year', 'ID']
    const rows = wishlist.map(i => [
      `"${(i.title || '').replace(/"/g, '""')}"`,
      i.type,
      i.year || '',
      i.id
    ])
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `culture-hub-stats-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section style={{ marginTop: 24, padding: 16, background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border-color)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{margin:0, color:'var(--text-primary)'}}>📊 Statistiques</h3>
        <button onClick={downloadCSV} style={{ fontSize: 12 }}>📑 CSV</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 12 }}>
        <div style={{ padding: 12, background: 'var(--bg-tertiary)', borderRadius: 4, textAlign: 'center', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--text-primary)' }}>{stats.total}</div>
          <div style={{ fontSize: 12, color: 'var(--text-light)' }}>Total</div>
        </div>
        <div style={{ padding: 12, background: 'var(--bg-tertiary)', borderRadius: 4, textAlign: 'center', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--text-primary)' }}>{stats.movies}</div>
          <div style={{ fontSize: 12, color: 'var(--text-light)' }}>Films</div>
        </div>
        <div style={{ padding: 12, background: 'var(--bg-tertiary)', borderRadius: 4, textAlign: 'center', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--text-primary)' }}>{stats.tv}</div>
          <div style={{ fontSize: 12, color: 'var(--text-light)' }}>Séries</div>
        </div>
        <div style={{ padding: 12, background: 'var(--bg-tertiary)', borderRadius: 4, textAlign: 'center', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--text-primary)' }}>{stats.books}</div>
          <div style={{ fontSize: 12, color: 'var(--text-light)' }}>Livres</div>
        </div>
      </div>
      {stats.years.length > 0 && (
        <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-light)' }}>
          <strong>Années:</strong> {stats.years.join(', ')}
        </div>
      )}
    </section>
  )
}
